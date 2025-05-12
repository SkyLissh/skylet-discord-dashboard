import { query } from "@solidjs/router";
import { Routes } from "discord-api-types/v10";
import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "~/db";
import { twitchAlerts } from "~/db/schema/twitch-alerts";

import { getSessionServer } from "~/lib/auth";
import { bot } from "../discord";
import { getTwitchUsers } from "./twitch";

import { Channel } from "~/schemas/channel";

export const getTwitchAlerts = query(async (guildId: string) => {
  "use server";
  await getSessionServer();

  const alerts = await db
    .select()
    .from(twitchAlerts)
    .where(eq(twitchAlerts.guildId, guildId));

  if (alerts.length === 0) return [];

  const twitchUsers = await getTwitchUsers(alerts.map((alert) => alert.streamer));

  if (!twitchUsers) return [];

  const response = await bot.get(Routes.guildChannels(guildId));
  const channels = v.parse(v.array(Channel), response);

  return alerts.map((alert) => ({
    ...alert,
    twitchUser: twitchUsers.find((user) => user.login === alert.streamer)!,
    channel: channels.find((channel) => channel.id === alert.channelId)!,
  }));
}, "twitch-alerts");

export const getTwitchAlertById = query(async (guildId: string, alertId: string) => {
  "use server";
  await getSessionServer();

  const [alert] = await db
    .select()
    .from(twitchAlerts)
    .where(and(eq(twitchAlerts.guildId, guildId), eq(twitchAlerts.id, alertId)));

  if (!alert) return undefined;

  return alert;
}, "twitch-alert");
