import "dotenv/config";
import pg from "pg";
import { createCorsair } from "corsair";

import { github } from "@corsair-dev/github";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const corsair = createCorsair({
  plugins: [
    github(),

   gmail({
  webhookHooks: {
    messageChanged: {
      after: async (_ctx, response) => {
        console.log("=================================");
        console.log("GMAIL WEBHOOK FIRED");
        console.log(JSON.stringify(response, null, 2));
        console.log("DATABASE_URL =", process.env.DATABASE_URL);
        console.log("=================================");
      },
    },
  },
}),

    googlecalendar(),
  ],

  database: db,
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: true,
});