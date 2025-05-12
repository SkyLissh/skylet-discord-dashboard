import type { RouteDefinition } from "@solidjs/router";
import { useAction, useParams, useSubmission } from "@solidjs/router";

import type { SubmitHandler } from "@modular-forms/solid";

import { showToast } from "~/components/ui/toast";

import { TwitchAlertFormComponent } from "~/components/forms/twitch-alert-form";

import type { TwitchAlertForm } from "~/schemas/forms/twitch-alert-form";

import { createTwitchAlert } from "~/lib/actions/twitch-alerts";
import { getChannels } from "~/lib/queries/channels";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    void getChannels(params.guild);
  },
};

export default function Page() {
  const params = useParams();

  const createAlert = useAction(createTwitchAlert);
  const alertSubmission = useSubmission(createTwitchAlert);

  const handleSubmit: SubmitHandler<TwitchAlertForm> = async (values) => {
    const formData = new FormData();
    formData.append("twitch_user", values.twitch_user);
    formData.append("discord_channel", values.discord_channel);
    formData.append("alert_message", values.alert_message);
    formData.append("guild", params.guild);
    formData.append("alert_id", "");

    const { error, variant } = await createAlert(formData);

    if (error) {
      showToast({
        description: error,
        variant: variant ?? "destructive",
      });
    }
  };

  return (
    <TwitchAlertFormComponent
      handleSubmit={handleSubmit}
      isLoading={alertSubmission.pending}
    />
  );
}
