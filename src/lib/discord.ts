import { REST } from "@discordjs/rest";

import { env } from "./env/server";

export const discord = (token: string) =>
  new REST({ version: "10", authPrefix: "Bearer" }).setToken(token);

export const bot = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);
