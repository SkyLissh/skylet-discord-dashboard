import { FetchError, ofetch } from "ofetch";
import * as v from "valibot";

import { env } from "~/lib/env/server";

import { TwitchToken } from "~/schemas/twitch/twitch-token";

let token: TwitchToken | undefined;

export const fetchTwitch = ofetch.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": env.TWITCH_CLIENT_ID,
  },
  mode: "cors",
  async onRequest({ options }) {
    if (token && token.expires_in > Date.now()) {
      options.headers.append("Authorization", `Bearer ${token.access_token}`);
      return;
    }

    try {
      const res = await ofetch<TwitchToken>("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        mode: "cors",
        body: {
          client_id: env.TWITCH_CLIENT_ID,
          client_secret: env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      });

      const { success, output } = v.safeParse(TwitchToken, res);

      if (!success) {
        token = undefined;

        return;
      }

      token = output;
      token.expires_in = Date.now() + token.expires_in * 1000;

      options.headers.append("Authorization", `Bearer ${token.access_token}`);
    } catch (error) {
      if (error instanceof FetchError) {
        token = undefined;

        return;
      }

      throw error;
    }
  },
  async onResponse({ response }) {
    const rateLimit = response.headers.get("RateLimit-Remaining");

    if (rateLimit && Number(rateLimit) <= 5 && response.status === 200) {
      const bucketReset = response.headers.get("RateLimit-Reset");

      const waitTime = Math.ceil(Number(bucketReset) - Date.now() / 1000);

      await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
    }
  },
});
