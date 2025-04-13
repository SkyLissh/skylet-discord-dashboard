import type { RouteDefinition } from "@solidjs/router";
import { A, createAsync, useParams } from "@solidjs/router";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import Home from "~icons/lucide/home";
import Twitch from "~icons/simple-icons/twitch";

import { getGuild } from "~/lib/queries/guilds";

export const route: RouteDefinition = {
  preload: ({ params }) => getGuild(params.guild),
};

export default function Page() {
  const params = useParams();

  const guild = createAsync(() => getGuild(params.guild));

  const socialMedia = [{ icon: Twitch, label: "Twitch" }];

  return (
    <main class="mx-auto max-w-7xl items-start px-4 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
      <aside class="sticky hidden shrink-0 overflow-y-auto lg:block">
        <ul class="flex flex-col gap-4">
          <li class="space-y-2">
            <p class="text-foreground/60 text-sm font-medium">{m.main()}</p>
            <ul class="flex flex-col gap-2">
              <li>
                <Button
                  as={A}
                  variant="ghost"
                  class="w-full justify-start"
                  href={localizeHref(`/dashboard/${params.guild}`)}
                >
                  <Home />
                  <span class="text-sm font-normal">{m.server()}</span>
                </Button>
              </li>
            </ul>
          </li>
          <li class="space-y-2">
            <p class="text-foreground/60 text-sm font-medium">{m.social_alerts()}</p>
            <ul class="flex flex-col gap-2">
              <For each={socialMedia}>
                {(item) => (
                  <li>
                    <Button
                      as={A}
                      variant="ghost"
                      class="w-full justify-start"
                      href={localizeHref(
                        `/dashboard/${params.guild}/${item.label.toLowerCase()}`
                      )}
                    >
                      <item.icon />
                      <span class="text-sm font-normal">{item.label}</span>
                    </Button>
                  </li>
                )}
              </For>
            </ul>
          </li>
        </ul>
      </aside>
      <pre>{JSON.stringify(guild(), null, 2)}</pre>
    </main>
  );
}
