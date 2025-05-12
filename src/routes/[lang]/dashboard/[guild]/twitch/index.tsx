import type { RouteDefinition } from "@solidjs/router";
import { A, createAsync, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { DeleteServiceAlert } from "~/components/delete_service_alert";

import { getTwitchAlerts } from "~/lib/queries/twitch-alerts";

import Pencil from "~icons/lucide/pencil";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    void getTwitchAlerts(params.guild);
  },
};

export default function Page() {
  const params = useParams();

  const alerts = createAsync(() => getTwitchAlerts(params.guild), { deferStream: true });

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>{m.twitch_alerts()}</CardTitle>
          <CardDescription>{m.twitch_alerts_description()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Show
            when={alerts() && alerts()?.length != 0}
            fallback={
              <div class="flex min-h-64 flex-col items-center justify-center gap-6">
                <p class="text-muted-foreground">
                  {m.no_alerts_yet({ service: "Twitch" })}
                </p>
                <Button
                  as={A}
                  href={localizeHref(`/dashboard/${params.guild}/twitch/create`)}
                >
                  {m.add_alert({ service: "Twitch" })}
                </Button>
              </div>
            }
          >
            <ul class="flex min-h-64 flex-col gap-4">
              <For each={alerts()}>
                {(alert) => (
                  <li>
                    <div class="bg-background border-border flex items-center gap-4 rounded-lg border p-4">
                      <img
                        src={alert.twitchUser.profile_image_url}
                        alt={alert.twitchUser.display_name}
                        class="bg-card size-12 rounded-full"
                      />
                      <div class="flex flex-col gap-2">
                        <p class="font-semibold">{alert.twitchUser.display_name}</p>
                        <p class="text-xs">{alert.channel.name}</p>
                      </div>
                      <div class="ml-auto flex items-center gap-4">
                        <Button
                          as={A}
                          href={localizeHref(
                            `/dashboard/${params.guild}/twitch/edit/${alert.id}`
                          )}
                          size="icon"
                          variant="secondary"
                        >
                          <Pencil />
                        </Button>
                        <DeleteServiceAlert service="twitch" alertId={alert.id} />
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </CardContent>
        <Show when={alerts()?.length !== 0}>
          <CardFooter class="justify-end gap-2">
            <Button
              as={A}
              href={localizeHref(`/dashboard/${params.guild}/twitch/create`)}
            >
              {m.add_alert({ service: "Twitch" })}
            </Button>
          </CardFooter>
        </Show>
      </Card>
    </section>
  );
}
