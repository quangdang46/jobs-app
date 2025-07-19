import { env } from "@/config/env/server";
import { UTApi } from "uploadthing/server";

export const uploadthing = new UTApi({ token: env.UPLOADTHING_TOKEN });
