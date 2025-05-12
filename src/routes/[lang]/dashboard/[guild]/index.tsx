import type { RouteDefinition } from "@solidjs/router";
import { createAsync, useParams } from "@solidjs/router";
import { createMemo } from "solid-js";

import { ChannelType } from "discord-api-types/v10";

import { m } from "~/paraglide/messages";

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

  return (
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
              <span class="text-sm font-normal">{guild()?.approximate_member_count}</span>
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
  );
}
