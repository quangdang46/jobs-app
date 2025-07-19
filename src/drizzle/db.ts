import { env } from "@/config/env/server";
// import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/drizzle/schema";

export const db = drizzle(env.DATABASE_URL!, { schema });
