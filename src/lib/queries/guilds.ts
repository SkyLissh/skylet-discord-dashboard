import { query } from "@solidjs/router";
import { PermissionFlagsBits, Routes } from "discord-api-types/v10";
import { eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "~/db";
import { accounts } from "~/db/schema/auth";

import { Guild, UserGuild } from "~/schemas/guild";

import { getSessionServer } from "~/lib/auth";
import { bot, discord } from "~/lib/discord";

export const getGuilds = query(async () => {
  "use server";

  const session = await getSessionServer();

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

  const response = await discord(account.accessToken!).get(Routes.userGuilds());
  const botResponse = await bot.get(Routes.userGuilds());

  const guilds = v.parse(v.array(UserGuild), response);

  const botGuilds = v.parse(v.array(UserGuild), botResponse);

  const adminGuilds = guilds.filter(
    (guild) => BigInt(guild.permissions) & PermissionFlagsBits.Administrator
  );

  return adminGuilds.filter((guild) =>
    botGuilds.some((botGuild) => botGuild.id === guild.id)
  );
}, "guilds");

export const getGuild = query(async (guildId: string) => {
  "use server";

  const response = await bot.get(Routes.guild(guildId), {
    query: new URLSearchParams({
      with_counts: "true",
    }),
  });

  return v.parse(Guild, response);
}, "guild");
