import * as v from "valibot";

export const Channel = v.object({
  id: v.string(),
  type: v.number(),
  guild_id: v.optional(v.string()),
  position: v.optional(v.number()),
  name: v.string(),
});

export type Channel = v.InferOutput<typeof Channel>;
