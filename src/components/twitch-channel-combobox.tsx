import { useQuery } from "@tanstack/solid-query";
import { createSignal, Match, Show, Suspense, Switch } from "solid-js";

import { m } from "~/paraglide/messages";

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

import { getTwitchUser } from "~/lib/queries/twitch";
import type { TwitchUser } from "~/schemas/twitch/twitch-user";

export function TwitchChannelCombobox(props: {
  value?: string;
  onChange: (username: string) => void;
}) {
  const value = () => props.value;
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal(value() ?? "");
  const [selected, setSelected] = createSignal<TwitchUser | undefined>();

  const query = useQuery(() => ({
    queryKey: ["twitch-user", search()],
    queryFn: () => getTwitchUser(search()),
    enabled: !!search(),
  }));

  return (
    <Combobox open={open()} onOpenChange={setOpen}>
      <ComboboxTrigger>
        <Show when={selected()} fallback={m.search_twitch_channel()}>
          {(channel) => (
            <div class="flex items-center gap-2">
              <img
                class="size-8 rounded-full object-cover"
                src={channel().profile_image_url}
                alt={channel().display_name}
              />
              {channel().display_name}
            </div>
          )}
        </Show>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          placeholder={m.write_to_search()}
          onValueChange={(value) => setSearch(value)}
        />
        <ComboboxList>
          <ComboboxEmpty>
            <Switch>
              <Match when={query.isPending}>{m.searching_twitch_channel()}</Match>
              <Match when={!query.data && !query.isPending}>{m.no_results()}</Match>
            </Switch>
          </ComboboxEmpty>
          <ComboboxGroup>
            <Suspense>
              <Show when={query.data}>
                {(channel) => (
                  <ComboboxItem
                    class="flex items-center gap-2"
                    value={channel().login}
                    onSelect={(value) => {
                      props.onChange(value);
                      setSelected(channel());
                      setOpen(false);
                    }}
                  >
                    <img
                      class="size-8 rounded-full object-cover"
                      src={channel().profile_image_url}
                      alt={channel().display_name}
                    />
                    {channel().display_name}
                  </ComboboxItem>
                )}
              </Show>
            </Suspense>
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
