import { defineConfig } from "drizzle-kit";

import { env } from "~/lib/env/server";

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema",
  dbCredentials: {
    url: env.TURSO_DB_URL,
    authToken: env.TURSO_DB_AUTH_TOKEN,
  },
});
