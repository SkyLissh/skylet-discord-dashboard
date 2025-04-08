import { createMiddleware } from "@solidjs/start/middleware";

import { overwriteGetLocale } from "~/paraglide/runtime";
import { paraglideMiddleware } from "~/paraglide/server.js";

export default createMiddleware({
  onRequest: ({ request }) => {
    return paraglideMiddleware(request, ({ request: paraglideRequest, locale }) => {
      request = paraglideRequest;
      overwriteGetLocale(() => locale);
    });
  },
});
