ALTER TABLE `guilds` ADD `guild_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_guild_id_unique` ON `guilds` (`guild_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `guild_idx` ON `guilds` (`guild_id`);