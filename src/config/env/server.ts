import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Optional DB connection parts (for development)
    DB_HOST: z.string().optional(),
    DB_PORT: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),
    
    // Required for all environments
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    
    // Optional, will be constructed if not provided
    DATABASE_URL: z.string().optional(),

    GEMINI_API_KEY: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
  createFinalSchema: (env) => {
    return z.object(env).transform((val) => {
      const {
        DB_HOST,
        DB_NAME,
        DB_PASSWORD,
        DB_PORT,
        DB_USER,
        DATABASE_URL,
        ...rest
      } = val;
      
      // If DATABASE_URL is provided, use it directly
      if (DATABASE_URL) {
        return {
          ...rest,
          DATABASE_URL,
        };
      }
      
      // If individual DB parts are provided, construct DATABASE_URL
      if (DB_HOST && DB_PORT && DB_USER && DB_PASSWORD && DB_NAME) {
        return {
          ...rest,
          DATABASE_URL: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        };
      }
      
      // Neither DATABASE_URL nor complete DB parts provided
      throw new Error("Either DATABASE_URL or all DB connection parts (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) must be provided");
    });
  },
});
