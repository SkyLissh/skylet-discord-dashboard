import { createAuthClient } from "better-auth/client";

export const auth = createAuthClient();

export const signIn = async () => {
  return await auth.signIn.social({
    provider: "discord",
    callbackURL: "/dashboard",
    scopes: [
      "identify",
      "email",
      "guilds",
      "guilds.members.read",
      "role_connections.write",
    ],
  });
};
