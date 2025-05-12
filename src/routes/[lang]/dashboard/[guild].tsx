import type { RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { A, createAsync, useNavigate, useParams } from "@solidjs/router";
import { For, createMemo } from "solid-js";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { Button } from "~/components/ui/button";

import { getSession } from "~/lib/queries/auth";
import { getGuilds } from "~/lib/queries/guilds";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "~/components/ui/combobox";
import Home from "~icons/lucide/house";
import Twitch from "~icons/simple-icons/twitch";

export const route: RouteDefinition = {
  preload: () => {
    void getSession();
    void getGuilds();
  },
};

export default function Layout(props: RouteSectionProps) {
  const params = useParams();
  const navigate = useNavigate();

  const guilds = createAsync(() => getGuilds(), { deferStream: true });

  const selectedGuild = createMemo(() =>
    guilds()?.find((guild) => guild.id === params.guild)
  );

  const socialMedia = [{ icon: Twitch, label: "Twitch" }];

  return (
    <main class="mx-auto max-w-7xl items-start px-4 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
      <aside class="sticky hidden shrink-0 overflow-y-auto lg:block">
        <ul class="flex flex-col gap-4">
          <li>
            <Combobox>
              <ComboboxTrigger>
                <div class="flex items-center gap-2">
                  <img
                    class="size-6 rounded-full object-cover"
                    src={selectedGuild()?.icon_url}
                    alt={selectedGuild()?.name}
                  />
                  <span class="truncate">{selectedGuild()?.name}</span>
                </div>
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput placeholder={m.search_server()} />
                <ComboboxList>
                  <ComboboxEmpty>{m.no_results()}</ComboboxEmpty>
                  <ComboboxGroup>
                    <For each={guilds()}>
                      {(guild) => (
                        <ComboboxItem
                          class="flex items-center gap-4 text-sm text-ellipsis"
                          value={guild.id}
                          keywords={[guild.name, guild.name.toLowerCase()]}
                          onSelect={(value) => {
                            navigate(localizeHref(`/dashboard/${value}`));
                          }}
                        >
                          <img
                            class="size-6 rounded-full object-cover"
                            src={guild.icon_url}
                            alt={guild.name}
                          />
                          <span class="truncate">{guild.name}</span>
                        </ComboboxItem>
                      )}
                    </For>
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </li>
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
      {props.children}
    </main>
  );
}
