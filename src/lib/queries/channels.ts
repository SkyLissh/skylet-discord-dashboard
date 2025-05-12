import { query } from "@solidjs/router";
import { Routes } from "discord-api-types/v10";
import * as v from "valibot";

import { getSessionServer } from "~/lib/auth";
import { bot } from "~/lib/discord";
import { Channel } from "~/schemas/channel";

export const getChannels = query(async (guildId: string) => {
  "use server";
  await getSessionServer();

  const response = await bot.get(Routes.guildChannels(guildId));

  return v.parse(v.array(Channel), response);
}, "channels");
