import crypto from "crypto";

import { json } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";

import { eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "~/db";
import { twitchAlerts } from "~/db/schema/twitch-alerts";

import { TwitchEventSub } from "~/schemas/twitch/twitch-eventsub";
import { TwitchMessageType } from "~/schemas/twitch/twitch-mesage-type";

import type { APIEmbed } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import { bot } from "~/lib/discord";
import { env } from "~/lib/env/server";
import { getTwitchGame, getTwitchStream, getTwitchUser } from "~/lib/queries/twitch";

async function sendNotification(notification: TwitchEventSub) {
  const userLogin = notification.event!.broadcaster_user_login;

  const alerts = await db
    .select()
    .from(twitchAlerts)
    .where(eq(twitchAlerts.streamer, userLogin));

  if (alerts.length === 0) return;

  const user = await getTwitchUser(userLogin);
  if (!user) return;

  const stream = await getTwitchStream(userLogin);
  if (!stream) return;

  const game = await getTwitchGame(stream.game_id!);
  if (!game) return;

  const messages = alerts.map(async (alert) => {
    await bot.post(Routes.channelMessages(alert.channelId), {
      body: {
        content: alert.message.replace("{{streamer}}", stream.user_name),
        tts: false,
        embeds: [
          {
            title: stream.title,
            author: {
              name: `${stream.user_name} is live on Twitch!`,
              url: `https://www.twitch.tv/${stream.user_login}`,
              icon_url: user.profile_image_url,
            },
            url: `https://www.twitch.tv/${stream.user_login}`,
            thumbnail: { url: game.box_art_url },
            image: {
              url: `${stream.thumbnail_url}?timestamp=${Date.now()}`,
            },
            fields: [
              { name: ":video_game: Playing", value: game.name },
              { name: ":eyes: Viewers", value: stream.viewer_count },
            ],
            footer: { text: "Started at" },
            timestamp: stream.started_at.toISOString(),
            color: 6570404,
          } as APIEmbed,
        ],
      },
    });
  });

  Promise.all(messages);
}

export async function POST(event: APIEvent) {
  const body = await event.request.text();

  const messageId = event.request.headers.get("twitch-eventsub-message-id");
  const timeStamp = event.request.headers.get("twitch-eventsub-message-timestamp");
  const message = `${messageId}${timeStamp}${body}`;

  const signature = crypto
    .createHmac("sha256", env.TWITCH_EVENT_SUB_SECRET)
    .update(message)
    .digest("hex");
  const signatureHeader = event.request.headers.get("twitch-eventsub-message-signature")!;

  const verified = crypto.timingSafeEqual(
    Buffer.from(`sha256=${signature}`),
    Buffer.from(signatureHeader)
  );

  if (!verified) return json({ error: "Invalid signature" }, { status: 403 });

  const messageTypeHeader = event.request.headers.get("twitch-eventsub-message-type");
  const messageType = v.parse(TwitchMessageType, messageTypeHeader);
  const notification = v.parse(TwitchEventSub, JSON.parse(body));

  if (messageType === "webhook_callback_verification") {
    return new Response(notification.challenge, { status: 200 });
  }
  if (messageType === "revocation") return new Response(null, { status: 204 });
  if (messageType === "notification") {
    void sendNotification(notification);
    return new Response(null, { status: 204 });
  }

  return json({ error: "Invalid message type" }, { status: 204 });
}
