import { ChannelType } from "discord-api-types/v10";
import { For, Match, Show, Switch, createMemo, createSignal } from "solid-js";

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

import { m } from "~/paraglide/messages";

import type { Channel } from "~/schemas/channel";

export function ChannelsCombobox(props: {
  channels: Channel[];
  value?: string;
  onChange: (channel: string) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const selectedChannel = createMemo(() =>
    props.channels.find((channel) => channel.id === props?.value)
  );

  return (
    <Combobox open={open()} onOpenChange={setOpen}>
      <ComboboxTrigger>
        <Show when={selectedChannel()} fallback={m.select_channel()}>
          {(channel) => <span>{channel().name}</span>}
        </Show>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder={m.search_channel()} />
        <ComboboxList>
          <ComboboxEmpty>{m.no_results()}</ComboboxEmpty>
          <ComboboxGroup>
            <For each={props.channels}>
              {(channel) => (
                <ComboboxItem
                  class="flex items-center gap-4 text-sm text-ellipsis"
                  value={channel.id}
                  keywords={[channel.name, channel.name.toLowerCase()]}
                  onSelect={(value) => {
                    props.onChange(value);
                    setOpen(false);
                  }}
                >
                  {channel.name}
                  <span class="text-muted-foreground text-xs uppercase">
                    <Switch>
                      <Match when={channel.type === ChannelType.GuildText}>
                        {m.text_channel()}
                      </Match>
                      <Match when={channel.type === ChannelType.GuildAnnouncement}>
                        {m.announcement_channel()}
                      </Match>
                      <Match when={channel.type === ChannelType.GuildVoice}>
                        {m.voice_channel()}
                      </Match>
                    </Switch>
                  </span>
                </ComboboxItem>
              )}
            </For>
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
