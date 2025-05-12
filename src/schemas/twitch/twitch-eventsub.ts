import * as v from "valibot";

import { TwitchSubscription } from "./twitch-subscription";

export const TwitchEventSub = v.object({
  challenge: v.optional(v.string()),
  subscription: TwitchSubscription,
  event: v.optional(
    v.object({
      id: v.optional(v.string()),
      broadcaster_user_id: v.string(),
      broadcaster_user_login: v.string(),
      broadcaster_user_name: v.string(),
      type: v.optional(
        v.picklist(["live", "playlist", "watch_party", "premiere", "rerun"])
      ),
      started_at: v.optional(
        v.pipe(
          v.string(),
          v.isoTimestamp(),
          v.transform((value) => new Date(value))
        )
      ),
    })
  ),
});

export type TwitchEventSub = v.InferOutput<typeof TwitchEventSub>;
