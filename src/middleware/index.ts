import { redirect } from "@solidjs/router";
import { createMiddleware } from "@solidjs/start/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { overwriteGetLocale } from "~/paraglide/runtime";

import { paraglideMiddleware } from "~/paraglide/server.js";

export default createMiddleware({
  onRequest: async ({ request }) => {
    // @ts-expect-error URLPattern is not defined
    if (!globalThis.URLPattern) {
      await import("urlpattern-polyfill");
    }

    // Skip middleware for API and server routes
    if (request.url.includes("api") || request.url.includes("_server")) return;

    // Check for protected routes (dashboard and related paths)
    const url = new URL(request.url);
    if (url.pathname.includes("/dashboard")) {
      const sessionCookie = getSessionCookie(request);
      if (!sessionCookie) {
        return redirect("/");
      }
    }

    return paraglideMiddleware(request, ({ request: localeRequest, locale }) => {
      request = localeRequest;
      overwriteGetLocale(() => locale);
    });
  },
});
