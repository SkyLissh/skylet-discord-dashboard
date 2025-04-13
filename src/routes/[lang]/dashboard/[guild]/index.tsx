import type { RouteDefinition } from "@solidjs/router";
import { A, createAsync, useParams } from "@solidjs/router";
import { For, createMemo } from "solid-js";

import { ChannelType } from "discord-api-types/v10";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import Home from "~icons/lucide/home";
import Twitch from "~icons/simple-icons/twitch";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { getChannels } from "~/lib/queries/channels";
import { getGuild } from "~/lib/queries/guilds";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    void getGuild(params.guild);
    void getChannels(params.guild);
  },
};

export default function Page() {
  const params = useParams();

  const guild = createAsync(() => getGuild(params.guild), { deferStream: true });
  const channels = createAsync(() => getChannels(params.guild), { deferStream: true });

  const categories = createMemo(() => {
    return channels()?.filter((channel) => channel.type === ChannelType.GuildCategory);
  });

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
      <section>
        <Card>
          <CardHeader>
            <CardTitle>{m.server_summary()}</CardTitle>
            <CardDescription>{m.stats_about_server()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid max-w-md grid-cols-2 gap-4">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">{m.members()}:</p>
                <span class="text-sm font-normal">
                  {guild()?.approximate_member_count}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">{m.channels()}:</p>
                <span class="text-sm font-normal">{channels()?.length}</span>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">{m.roles()}:</p>
                <span class="text-sm font-normal">{guild()?.roles.length}</span>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">{m.categories()}:</p>
                <span class="text-sm font-normal">{categories()?.length}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div class="flex items-center gap-2">
              <p class="text-xs font-medium">{m.id()}:</p>
              <span class="text-primary text-xs font-normal">/{guild()?.id}</span>
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
