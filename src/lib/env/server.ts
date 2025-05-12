import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  server: {
    TURSO_DB_URL: v.string(),
    TURSO_DB_AUTH_TOKEN: v.string(),
    BETTER_AUTH_SECRET: v.string(),
    BETTER_AUTH_URL: v.string(),
    DISCORD_CLIENT_ID: v.string(),
    DISCORD_CLIENT_SECRET: v.string(),
    DISCORD_BOT_TOKEN: v.string(),
    TWITCH_CLIENT_ID: v.string(),
    TWITCH_CLIENT_SECRET: v.string(),
    TWITCH_EVENT_SUB_SECRET: v.string(),
    BASE_URL: v.pipe(v.string(), v.url()),
    TWITCH_EVENT_SUB_CALLBACK: v.pipe(v.string(), v.url()),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
