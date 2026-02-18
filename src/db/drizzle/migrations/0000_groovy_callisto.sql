CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`cover_Image_Url` text NOT NULL,
	`published` integer NOT NULL,
	`created_At` text NOT NULL,
	`updated_At` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);