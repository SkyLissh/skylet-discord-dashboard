import * as v from "valibot";

export const DiscordProfile = v.pipe(
  v.object({
    id: v.string(),
    username: v.string(),
    discriminator: v.string(),
    avatar: v.string(),
    global_name: v.nullable(v.string()),
    accent_color: v.nullable(v.number()),
    banner: v.nullable(v.string()),
  }),
  v.transform((profile) => ({
    ...profile,
    avatar_url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
    name: profile.global_name ?? profile.username,
  }))
);

export type DiscordProfile = v.InferOutput<typeof DiscordProfile>;
