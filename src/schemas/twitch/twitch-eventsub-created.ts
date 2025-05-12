import * as v from "valibot";

import { TwitchSubscription } from "./twitch-subscription";

export const TwitchEventSubCreated = v.object({
  data: v.array(TwitchSubscription),
  total: v.number(),
  total_cost: v.number(),
  max_total_cost: v.number(),
});

export type TwitchEventSubCreated = v.InferOutput<typeof TwitchEventSubCreated>;
