import type { RouteDefinition } from "@solidjs/router";
import { A, createAsync } from "@solidjs/router";
import { createMemo, createSignal, For, Show } from "solid-js";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { Button } from "~/components/ui/button";
import { TextField, TextFieldIcon, TextFieldInput } from "~/components/ui/text-field";

import Crown from "~icons/lucide/crown";
import Search from "~icons/lucide/search";
import Shield from "~icons/lucide/shield";

import { getSession } from "~/lib/queries/auth";
import { getGuilds } from "~/lib/queries/guilds";
import { removeDiacritics } from "~/lib/utils";

export const route: RouteDefinition = {
  preload: () => {
    void getSession();
    void getGuilds();
  },
};

export default function Page() {
  const guilds = createAsync(() => getGuilds(), { deferStream: true });
  const session = createAsync(() => getSession(), { deferStream: true });

  const [search, setSearch] = createSignal("");
  const filteredGuilds = createMemo(() =>
    guilds()?.filter((guild) => {
      const name = removeDiacritics(guild.name.toLocaleLowerCase());
      const query = removeDiacritics(search().toLocaleLowerCase());

      return name.includes(query);
    })
  );

  return (
    <main class="mx-auto flex max-w-7xl flex-col gap-12 py-20">
      <Show when={session()?.user}>
        {(user) => (
          <div class="flex items-center gap-4">
            <img
              src={user().image!}
              alt={user().name}
              class="size-12 rounded-full"
              loading="lazy"
            />
            <div class="flex flex-col gap-1">
              <h1 class="text-2xl font-semibold">
                {m.user_servers({ username: user().name })}
              </h1>
              <p class="text-sm">{m.choose_manage_server()}</p>
            </div>
          </div>
        )}
      </Show>
      <TextField class="relative">
        <TextFieldInput
          class="peer py-6 ps-9"
          type="search"
          placeholder={m.search_server()}
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <TextFieldIcon>
          <Search class="size-4" />
        </TextFieldIcon>
      </TextField>
      <ul class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        <For each={filteredGuilds()}>
          {(guild) => (
            <li>
              <article class="border-border bg-card text-card-foreground rounded-2xl border">
                <div class="relative h-20 w-full overflow-hidden rounded-t-2xl bg-zinc-400">
                  <img
                    src={guild.icon_url}
                    alt={guild.name}
                    class="absolute top-0 left-0 size-full object-cover brightness-[0.45]"
                    loading="lazy"
                  />
                  <div class="size-full backdrop-blur-md" />
                </div>
                <div class="bg-card relative z-10 flex flex-col items-center rounded-b-2xl p-4">
                  <div class="relative -mt-16 mb-3 size-16 rounded-full">
                    <img
                      src={guild.icon_url}
                      alt={guild.name}
                      class="ring-primary size-16 rounded-full ring-4"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex w-full items-center justify-between space-x-4 px-2">
                    <div class="min-w-0 flex-1 space-y-2">
                      <p class="truncate text-sm">{guild.name}</p>
                      <span class="text-muted-foreground flex items-center gap-1 text-sm">
                        <Show when={guild.owner} fallback={<Shield class="size-4" />}>
                          <Crown class="size-4 text-yellow-500" />
                        </Show>
                        <Show when={guild.owner} fallback={m.admin()}>
                          <span class="text-primary">{m.owner()}</span>
                        </Show>
                      </span>
                    </div>
                    <Button
                      as={A}
                      href={localizeHref(`/dashboard/${guild.id}`)}
                      variant="secondary"
                      class="px-6"
                    >
                      {m.go()}
                    </Button>
                  </div>
                </div>
              </article>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
