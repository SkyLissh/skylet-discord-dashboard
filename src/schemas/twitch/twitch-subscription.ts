import * as v from "valibot";

export const TwitchSubscription = v.object({
  id: v.pipe(v.string(), v.uuid()),
  status: v.picklist([
    "enabled",
    "webhook_callback_verification_pending",
    "authorization_revoked",
    "webhook_callback_verification_failed",
  ]),
  type: v.picklist([
    "channel.follow",
    "channel.subscribe",
    "channel.cheer",
    "channel.raid",
    "channel.ban",
    "stream.online",
    "stream.offline",
  ]),
  cost: v.number(),
  version: v.string(),
  condition: v.object({
    broadcaster_user_id: v.string(),
  }),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  transport: v.object({
    method: v.picklist(["webhook", "websocket"]),
    callback: v.nullable(v.pipe(v.string(), v.url())),
  }),
});

export type TwitchSubscription = v.InferOutput<typeof TwitchSubscription>;
