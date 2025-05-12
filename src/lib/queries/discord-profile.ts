import { query } from "@solidjs/router";

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { accounts } from "~/db/schema/auth";

import * as v from "valibot";

import { Routes } from "discord-api-types/v10";

import { getMaybeSessionServer } from "~/lib/auth";
import { discord } from "~/lib/discord";

import { DiscordProfile } from "~/schemas/discord-profile";

export const getProfile = query(async () => {
  "use server";
  const session = await getMaybeSessionServer();

  if (!session) return undefined;

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

  const profile = await discord(account.accessToken!).get(Routes.user());

  return v.parse(DiscordProfile, profile);
}, "profile");
