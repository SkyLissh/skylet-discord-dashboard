import { useAction, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

import { capitalize } from "es-toolkit/string";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { m } from "~/paraglide/messages";

import { deleteTwitchAlert } from "~/lib/actions/twitch-alerts";

import CircleLoader from "~icons/lucide/loader-circle";
import Trash from "~icons/lucide/trash";

export function DeleteServiceAlert(props: { service: "twitch"; alertId: string }) {
  const [open, setOpen] = createSignal(false);
  const deleteAlert = useAction(deleteTwitchAlert);
  const submission = useSubmission(deleteTwitchAlert);

  const onDeleteAlert = async () => {
    await deleteAlert(props.alertId, props.service);
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="destructive" size="icon">
        <Trash />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {m.delete_service_alert({ service: capitalize(props.service) })}
          </DialogTitle>
          <DialogDescription>
            {m.delete_service_alert_desc({ service: capitalize(props.service) })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {m.cancel()}
          </Button>
          <Button
            onClick={onDeleteAlert}
            variant="destructive"
            disabled={submission.pending}
          >
            <Show when={submission.pending}>
              <CircleLoader class="size-4 animate-spin" />
            </Show>
            {m.delete()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
