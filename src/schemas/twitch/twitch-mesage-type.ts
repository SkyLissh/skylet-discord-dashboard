import * as v from "valibot";

export const TwitchMessageType = v.union([
  v.literal("webhook_callback_verification"),
  v.literal("notification"),
  v.literal("revocation"),
]);
