import { action, redirect, reload } from "@solidjs/router";
import { setCookie } from "vinxi/http";

import { capitalize } from "es-toolkit/string";
import * as v from "valibot";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { twitchAlerts } from "~/db/schema/twitch-alerts";

import {
  getTwitchSubscriptions,
  getTwitchUser,
  suscribeTwitchEvent,
} from "~/lib/queries/twitch";

import { TwitchAlertForm } from "~/schemas/forms/twitch-alert-form";

import type { ToastVariant } from "~/components/ui/toast";
import { getTwitchAlerts } from "../queries/twitch-alerts";

export const createTwitchAlert = action(
  async (formData: FormData): Promise<{ error: string; variant?: ToastVariant }> => {
    "use server";
    const data = v.parse(TwitchAlertForm, Object.fromEntries(formData.entries()));
    const streamer = await getTwitchUser(data.twitch_user);

    if (!streamer) {
      return { error: m.should_add_twitch_channel() };
    }

    const [alert] = await db
      .select()
      .from(twitchAlerts)
      .where(
        and(
          eq(twitchAlerts.streamer, data.twitch_user),
          eq(twitchAlerts.guildId, data.guild)
        )
      )
      .limit(1);

    if (alert) return { error: m.alert_already_exists(), variant: "warning" };

    const subscriptions = await getTwitchSubscriptions();
    const subscriptionExists = subscriptions?.find(
      (sub) => Number(sub.condition.broadcaster_user_id) === streamer.id
    );

    if (!subscriptionExists) {
      const eventsub = await suscribeTwitchEvent(streamer.login);

      if (
        eventsub.message !== "subscription created" &&
        eventsub.message !== "subscription already exists"
      ) {
        return { error: m.some_error_occurred() };
      }
    }

    const [alertCreated] = await db
      .insert(twitchAlerts)
      .values({
        channelId: data.discord_channel,
        streamer: data.twitch_user,
        message: data.alert_message,
        guildId: data.guild,
      })
      .returning();

    setCookie(
      "toast",
      JSON.stringify({
        title: m.alert_created({ streamer: streamer.display_name }),
        description: m.alert_created_desc(),
        variant: "success",
      }),
      {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      }
    );

    throw redirect(localizeHref(`/dashboard/${alertCreated.guildId}/twitch`), {
      revalidate: [getTwitchAlerts.key],
    });
  }
);

export const updateTwitchAlert = action(
  async (formData: FormData): Promise<{ error: string; variant?: ToastVariant }> => {
    "use server";

    const data = v.parse(TwitchAlertForm, Object.fromEntries(formData.entries()));
    const streamer = await getTwitchUser(data.twitch_user);

    if (!streamer) {
      return { error: m.should_add_twitch_channel() };
    }

    const subscriptions = await getTwitchSubscriptions();
    const subscriptionExists = subscriptions?.find(
      (sub) => Number(sub.condition.broadcaster_user_id) === streamer.id
    );

    if (!subscriptionExists) {
      const eventsub = await suscribeTwitchEvent(streamer.login);

      if (
        eventsub.message !== "subscription created" &&
        eventsub.message !== "subscription already exists"
      ) {
        return { error: m.some_error_occurred() };
      }
    }

    const [alertUpdated] = await db
      .update(twitchAlerts)
      .set({
        channelId: data.discord_channel,
        streamer: data.twitch_user,
        message: data.alert_message,
      })
      .where(eq(twitchAlerts.id, data.alert_id!))
      .returning();

    setCookie(
      "toast",
      JSON.stringify({
        title: m.alert_updated({ streamer: streamer.display_name }),
        variant: "success",
      }),
      {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      }
    );

    throw redirect(localizeHref(`/dashboard/${alertUpdated.guildId}/twitch`), {
      revalidate: [getTwitchAlerts.key],
    });
  }
);

export const deleteTwitchAlert = action(async (alertId: string, service: "twitch") => {
  "use server";

  await db.delete(twitchAlerts).where(eq(twitchAlerts.id, alertId)).returning();

  setCookie(
    "toast",
    JSON.stringify({
      title: m.service_alert_deleted({ service: capitalize(service) }),
      variant: "success",
    }),
    {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    }
  );

  throw reload({ revalidate: [getTwitchAlerts.key] });
});
