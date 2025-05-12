import type { RouteDefinition } from "@solidjs/router";
import { createAsync, useAction, useParams, useSubmission } from "@solidjs/router";

import type { SubmitHandler } from "@modular-forms/solid";

import { showToast } from "~/components/ui/toast";

import { TwitchAlertFormComponent } from "~/components/forms/twitch-alert-form";

import type { TwitchAlertForm } from "~/schemas/forms/twitch-alert-form";

import { updateTwitchAlert } from "~/lib/actions/twitch-alerts";
import { getChannels } from "~/lib/queries/channels";
import { getTwitchAlertById } from "~/lib/queries/twitch-alerts";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    void getChannels(params.guild);
    void getTwitchAlertById(params.guild, params.alertId);
  },
};

export default function Page() {
  const params = useParams();

  const updateAlert = useAction(updateTwitchAlert);
  const alertSubmission = useSubmission(updateTwitchAlert);

  const alert = createAsync(() => getTwitchAlertById(params.guild, params.alertId));

  const handleSubmit: SubmitHandler<TwitchAlertForm> = async (values) => {
    const formData = new FormData();
    formData.append("twitch_user", values.twitch_user);
    formData.append("discord_channel", values.discord_channel);
    formData.append("alert_message", values.alert_message);
    formData.append("guild", params.guild);
    formData.append("alert_id", params.alertId);

    const { error, variant } = await updateAlert(formData);

    if (error) {
      showToast({
        description: error,
        variant: variant ?? "destructive",
      });
    }
  };

  return (
    <TwitchAlertFormComponent
      initialValues={{
        twitch_user: alert()?.streamer ?? "",
        discord_channel: alert()?.channelId ?? "",
        alert_message: alert()?.message ?? "",
        guild: params.guild,
        alert_id: params.alertId,
      }}
      handleSubmit={handleSubmit}
      isLoading={alertSubmission.pending}
    />
  );
}
