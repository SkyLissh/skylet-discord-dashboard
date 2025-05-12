import { A, createAsync, useParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";

import type { SubmitHandler } from "@modular-forms/solid";
import { createForm, setValue, valiForm } from "@modular-forms/solid";

import { ChannelType } from "discord-api-types/v10";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { ChannelsCombobox } from "~/components/channels-combobox";
import { TwitchChannelCombobox } from "~/components/twitch-channel-combobox";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";

import { getChannels } from "~/lib/queries/channels";

import { TwitchAlertForm as TwitchAlertFormSchema } from "~/schemas/forms/twitch-alert-form";

import LoaderCircle from "~icons/lucide/loader-circle";

type Props = {
  initialValues?: TwitchAlertFormSchema;
  handleSubmit: SubmitHandler<TwitchAlertFormSchema>;
  isLoading?: boolean;
};

export function TwitchAlertFormComponent(props: Props) {
  const params = useParams();
  const channels = createAsync(() => getChannels(params.guild), { deferStream: true });

  const [alertForm, { Form, Field }] = createForm<TwitchAlertFormSchema>({
    validate: valiForm(TwitchAlertFormSchema),
  });

  const filteredChannels = createMemo(() => {
    return (
      channels()?.filter(
        (channel) =>
          channel.type === ChannelType.GuildText ||
          channel.type === ChannelType.GuildAnnouncement ||
          channel.type === ChannelType.GuildVoice
      ) ?? []
    );
  });

  return (
    <section>
      <Form onSubmit={props.handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{m.add_alert({ service: "Twitch" })}</CardTitle>
            <CardDescription>{m.add_twitch_alert_desc()}</CardDescription>
          </CardHeader>
          <CardContent class="flex max-w-[500px] flex-col gap-4">
            <Field name="alert_id">
              {(_, props) => (
                <input type="text" {...props} hidden value={params.alertId} />
              )}
            </Field>
            <Field name="guild">
              {(_, props) => <input type="text" {...props} hidden value={params.guild} />}
            </Field>
            <div class="flex flex-col gap-2">
              <p class="text-sm font-medium">{m.twitch_channel()}</p>
              <span class="text-muted-foreground text-xs">
                {m.enter_twitch_channel_name()}
              </span>
              <Field name="twitch_user">
                {(field) => (
                  <>
                    <TwitchChannelCombobox
                      value={field.value}
                      onChange={(value) => setValue(alertForm, "twitch_user", value)}
                    />
                    {field.error && <p class="text-error text-xs">{field.error}</p>}
                  </>
                )}
              </Field>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-sm font-medium">{m.discord_channel()}</p>
              <span class="text-muted-foreground text-xs">
                {m.choose_discord_channel()}
              </span>
              <Field name="discord_channel">
                {(field) => (
                  <>
                    <ChannelsCombobox
                      channels={filteredChannels()}
                      value={field.value}
                      onChange={(value) => setValue(alertForm, "discord_channel", value)}
                    />
                    {field.error && (
                      <p class="text-error-foreground text-xs">{field.error}</p>
                    )}
                  </>
                )}
              </Field>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-sm font-medium">{m.alert_message()}</p>
              <span class="text-muted-foreground text-xs">
                {m.enter_alert_message()}
                <code>{" {{streamer}} "}</code>
                {m.to_mention_streamer()}
              </span>
              <Field name="alert_message">
                {(field, props) => (
                  <>
                    <TextField>
                      <TextFieldTextArea
                        rows={5}
                        placeholder={m.write_alert_message()}
                        {...props}
                      />
                    </TextField>
                    {field.error && (
                      <p class="text-error-foreground text-xs">{field.error}</p>
                    )}
                  </>
                )}
              </Field>
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-4">
            <Button
              as={A}
              href={localizeHref(`/dashboard/${params.guild}/twitch`)}
              variant="secondary"
            >
              {m.cancel()}
            </Button>
            <Button type="submit" disabled={props.isLoading}>
              <Show when={props.isLoading}>
                <LoaderCircle class="size-4 animate-spin" />
              </Show>
              {m.save_changes()}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
}
