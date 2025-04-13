import { createMiddleware } from "@solidjs/start/middleware";
import { overwriteGetLocale } from "~/paraglide/runtime";

import { paraglideMiddleware } from "~/paraglide/server.js";

export default createMiddleware({
  onRequest: async ({ request }) => {
    // @ts-expect-error
    if (!globalThis.URLPattern) {
      await import("urlpattern-polyfill");
    }

    if (request.url.includes("api") || request.url.includes("_server")) return;

    return paraglideMiddleware(request, ({ request: localeRequest, locale }) => {
      request = localeRequest;
      overwriteGetLocale(() => locale);
    });
  },
});
