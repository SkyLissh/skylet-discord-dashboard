import { paraglideMiddleware } from "@/paraglide/server";
import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: ({ request }) => {
    paraglideMiddleware(request, ({ request, locale }) => {
      request.headers.set("x-paraglide-locale", locale);
      request.headers.set("x-paraglide-request-url", request.url);

      return new Response();
    });
  },
});
