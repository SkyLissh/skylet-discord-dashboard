PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_twitch_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`streamer` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`guild_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_twitch_alerts`("id", "guild_id", "channel_id", "streamer", "message", "created_at") SELECT "id", "guild_id", "channel_id", "streamer", "message", "created_at" FROM `twitch_alerts`;--> statement-breakpoint
DROP TABLE `twitch_alerts`;--> statement-breakpoint
ALTER TABLE `__new_twitch_alerts` RENAME TO `twitch_alerts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;