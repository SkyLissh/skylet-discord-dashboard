import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getRequestEvent } from "solid-js/web";

import { db } from "~/db";
import * as schema from "~/db/schema/auth";

import { env } from "~/lib/env/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
      },
    },
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      mapProfileToUser: (profile) => ({
        id: profile.id,
        name: profile.display_name ?? profile.global_name ?? profile.username,
        email: profile.email,
        username: profile.username,
        image: profile.image_url,
        emailVerified: profile.verified,
      }),
    },
  },
});

export async function getMaybeSessionServer() {
  "use server";

  const event = getRequestEvent();

  if (!event) throw new Error("No event");
  const session = await auth.api.getSession({ headers: event.request.headers });

  return session ?? undefined;
}

export async function getSessionServer() {
  "use server";

  const event = getRequestEvent();

  if (!event) throw new Error("No event");

  const session = await getMaybeSessionServer();

  if (!session) {
    await auth.api.signInSocial({
      body: {
        provider: "discord",
        callbackUrl: new URL(event.request.url).pathname,
        scopes: [
          "identify",
          "email",
          "guilds",
          "guilds.members.read",
          "role_connections.write",
        ],
      },
    });

    throw new Error("No session");
  }

  return session;
}
