import "dotenv/config";
import { Pool } from "pg";
import { createCorsair } from "corsair";
import { github } from "@corsair-dev/github";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const corsair = createCorsair({
  plugins: [github()],
  database: db,
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: true,
});