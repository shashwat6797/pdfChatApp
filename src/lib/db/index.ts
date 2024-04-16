import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

if (!process.env.PSQL_URL) {
  throw new Error("databse url not found");
}

const sql = neon(process.env.PSQL_URL);

export const db = drizzle(sql);
