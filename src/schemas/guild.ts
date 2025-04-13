import * as v from "valibot";

export const UserGuild = v.pipe(
  v.object({
    id: v.string(),
    name: v.string(),
    icon: v.string(),
    banner: v.nullable(v.string()),
    owner: v.optional(v.boolean(), false),
    permissions: v.string(),
  }),
  v.transform((guild) => ({
    ...guild,
    icon_url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`,
  }))
);

export type UserGuild = v.InferOutput<typeof UserGuild>;

export const Guild = v.object({
  ...UserGuild.entries,
  permissions: v.optional(v.string()),
  roles: v.array(
    v.object({
      id: v.string(),
      name: v.string(),
      color: v.number(),
      position: v.number(),
      permissions: v.string(),
      icon: v.nullable(v.string()),
      unicode_emoji: v.nullable(v.string()),
      mentionable: v.boolean(),
      hoist: v.boolean(),
    })
  ),
  approximate_member_count: v.number(),
  approximate_presence_count: v.number(),
  premium_subscription_count: v.number(),
  premium_tier: v.number(),
  premium_progress_bar_enabled: v.boolean(),
  nsfw_level: v.number(),
  afk_channel_id: v.nullable(v.string()),
  afk_timeout: v.number(),
  widget_enabled: v.boolean(),
  widget_channel_id: v.nullable(v.string()),
  system_channel_id: v.nullable(v.string()),
  system_channel_flags: v.number(),
  rules_channel_id: v.nullable(v.string()),
  public_updates_channel_id: v.nullable(v.string()),
  max_video_channel_users: v.number(),
  max_stage_video_channel_users: v.number(),
  vanity_url_code: v.nullable(v.string()),
});
