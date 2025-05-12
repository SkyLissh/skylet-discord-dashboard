// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getLocale } from "~/paraglide/runtime";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang={getLocale()}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="shortcut icon" href="/favicon.png" />
          {assets}
        </head>
        <body class="bg-zinc-900 text-zinc-50">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
