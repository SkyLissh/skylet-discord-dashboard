import { action, query } from "@solidjs/router";
import { FetchError } from "ofetch";
import * as v from "valibot";

import { getSessionServer } from "~/lib/auth";
import { env } from "~/lib/env/server";
import { fetchTwitch } from "~/lib/twitch";
import { TwitchEventSubCreated } from "~/schemas/twitch/twitch-eventsub-created";

import { TwitchGame } from "~/schemas/twitch/twitch-game";
import { paginatedTwitchResponse } from "~/schemas/twitch/twitch-paginated";
import { TwitchStream } from "~/schemas/twitch/twitch-stream";
import { TwitchSubscription } from "~/schemas/twitch/twitch-subscription";
import { TwitchUser } from "~/schemas/twitch/twitch-user";

export const getTwitchUser = async (username?: string) => {
  "use server";

  if (!username) return null;

  const res = await fetchTwitch("/users", {
    query: {
      login: username,
    },
  });

  const { output: user, success } = v.safeParse(paginatedTwitchResponse(TwitchUser), res);

  if (!success) return null;
  if (user.data.length === 0) return null;

  return user.data[0];
};

export const getTwitchUsers = async (usernames: string[]) => {
  "use server";

  const query = usernames.map((username) => `login=${username}`).join("&");
  const res = await fetchTwitch(`/users?${query}`);

  const { output: users, success } = v.safeParse(
    paginatedTwitchResponse(TwitchUser),
    res
  );

  if (!success) return null;

  return users.data;
};

export const getTwitchStream = async (username: string) => {
  "use server";

  const res = await fetchTwitch("/streams", {
    query: { user_login: username },
  });

  const { output: stream, success } = v.safeParse(
    paginatedTwitchResponse(TwitchStream),
    res
  );

  if (!success) return null;
  if (stream.data.length === 0) return null;

  return stream.data[0];
};

export const getTwitchGame = async (gameId: number) => {
  "use server";

  const res = await fetchTwitch("/games", {
    query: { id: gameId },
  });

  const { output: game, success } = v.safeParse(paginatedTwitchResponse(TwitchGame), res);

  if (!success) return null;
  if (game.data.length === 0) return null;

  return game.data[0];
};

export const suscribeTwitchEvent = async (streamer: string) => {
  "use server";
  await getSessionServer();

  const user = await getTwitchUser(streamer);

  if (!user) return { message: "user not found" };

  try {
    const res = await fetchTwitch("/eventsub/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        type: "stream.online",
        version: "1",
        condition: {
          broadcaster_user_id: `${user.id}`,
        },
        transport: {
          method: "webhook",
          callback: env.TWITCH_EVENT_SUB_CALLBACK,
          secret: env.TWITCH_EVENT_SUB_SECRET,
        },
      }),
    });

    const { success } = v.safeParse(TwitchEventSubCreated, res);

    if (!success) return { message: "parsing failed" };

    return { message: "subscription created" };
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.status === 409) return { message: "subscription already exists" };
    }
    return { message: "some error occurred" };
  }
};

const unsubscribeTwitchEvent = async (subscriptionId: string) => {
  "use server";
  await getSessionServer();

  try {
    const res = await fetchTwitch.raw("/eventsub/subscriptions", {
      method: "DELETE",
      query: {
        id: subscriptionId,
      },
    });

    return res.ok;
  } catch {
    return false;
  }
};

export const unsubscribeAllTwitchEvents = action(
  async (subscriptions: TwitchSubscription[]) => {
    "use server";
    await getSessionServer();

    if (!subscriptions) return false;

    for (const subscription of subscriptions) {
      await unsubscribeTwitchEvent(subscription.id);
    }

    return true;
  },
  "unsubscribeAllTwitchEvents"
);

export const getTwitchSubscriptions = query(async () => {
  "use server";
  await getSessionServer();

  try {
    const res = await fetchTwitch("/eventsub/subscriptions");

    const { output: subscriptions, success } = v.safeParse(
      v.array(TwitchSubscription),
      res.data
    );

    if (!success) return null;

    return subscriptions;
  } catch {
    return null;
  }
}, "getTwitchSubscriptions");
