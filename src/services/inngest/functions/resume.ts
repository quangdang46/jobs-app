import { env } from "@/config/env/server";
import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { updateUserResume } from "@/features/users/db/userResume";
import { inngest } from "@/services/inngest/client";
import { eq } from "drizzle-orm";

export const createAISummary = inngest.createFunction(
  {
    id: "create-ai-summary",
    name: "Create AI Summary",
  },
  {
    event: "app/resume/resume.uploaded",
  },
  async ({ event, step }) => {
    console.log("🚀 Starting AI summary creation for event:", event);
    const { userId } = event.user;
    console.log("👤 User ID:", userId);

    const userResume = await step.run("get-user-resume", async () => {
      console.log("📄 Fetching user resume for userId:", userId);
      const resume = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
          resumeFileUrl: true,
        },
      });
      console.log("📋 User resume found:", resume);
      if (!resume) {
        console.log("❌ No resume found for user:", userId);
        return null;
      }

      console.log("🔗 Resume file URL:", resume.resumeFileUrl);

      return resume;
    });

    if (!userResume) {
      console.log("❌ No resume found for user:", userId);
      return;
    }

    const fileContent = await step.run("fetch-file-content", async () => {
      console.log(
        "📥 Fetching file content from URL:",
        userResume.resumeFileUrl
      );
      try {
        const response = await fetch(userResume.resumeFileUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status} ${response.statusText}`
          );
        }

        // Log response details for debugging
        console.log(
          "📋 Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        console.log(
          "📏 Content length:",
          response.headers.get("content-length")
        );
        console.log("📄 Content type:", response.headers.get("content-type"));

        const arrayBuffer = await response.arrayBuffer();
        console.log("📊 ArrayBuffer size:", arrayBuffer.byteLength, "bytes");

        // Check if it's a valid PDF by looking at the first few bytes
        const uint8Array = new Uint8Array(arrayBuffer);
        const firstBytes = Array.from(uint8Array.slice(0, 8))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
        console.log("🔍 First 8 bytes:", firstBytes);

        // PDF files should start with %PDF
        const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4));
        console.log(
          "📄 PDF header check:",
          pdfHeader,
          pdfHeader === "%PDF" ? "✅ Valid PDF" : "❌ Not a PDF"
        );

        const base64 = Buffer.from(arrayBuffer).toString("base64");
        console.log("✅ File content fetched and converted to base64");
        console.log("📏 Base64 length:", base64.length);

        return base64;
      } catch (error) {
        console.error("❌ Error fetching file content:", error);
        throw error;
      }
    });

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash",
        apiKey: env.GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "You are an expert resume analyzer. I will provide you with a PDF resume file. Please extract and analyze all the information from this resume.\n\n**Instructions:**\n1. Read the entire PDF document carefully\n2. Extract all text content including headers, bullet points, and descriptions\n3. Create a concise, beautiful summary with the following structure:\n\n## 👤 Personal Information\n## 🎯 Career Objective\n## 💼 Work Experience\n## 🎓 Education\n## 🛠️ Key Skills\n## 🏆 Notable Achievements\n\n**Important:**\n- Use beautiful markdown formatting with emojis\n- Be concise but comprehensive\n- Focus on information valuable to hiring managers\n- If you cannot read the PDF or it's not a resume, respond with exactly 'N/A'\n- Make sure to extract ALL relevant information from the document",
              },
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: fileContent,
                },
              },
            ],
          },
        ],
      },
    });

    console.log("🤖 AI Response received:", JSON.stringify(result, null, 2));

    await step.run("save-ai-summary", async () => {
      console.log("💾 Saving AI summary...");
      const message = result.candidates?.[0]?.content.parts[0];
      console.log("📝 Message part:", message);
      console.log("📝 Message type:", typeof message);

      if (!message || !("text" in message)) {
        console.log("❌ No valid message or text found");
        return;
      }

      const summaryText = (message as { text: string }).text;
      console.log("✅ Saving summary:", summaryText.substring(0, 100) + "...");
      await updateUserResume(userId, {
        aiSummary: summaryText,
      });
      console.log("✅ AI summary saved successfully");
    });
  }
);
