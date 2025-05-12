import type { RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { createEffect } from "solid-js";

import { MainHeader } from "~/components/main-header";
import { showToast } from "~/components/ui/toast";

import { getProfile } from "~/lib/queries/discord-profile";
import { getToastMessage } from "~/lib/queries/toast";

export const route: RouteDefinition = {
  preload: () => getProfile(),
};

export default function Layout(props: RouteSectionProps) {
  const profile = createAsync(() => getProfile(), { deferStream: true });
  const toast = createAsync(() => getToastMessage());

  createEffect(() => {
    if (toast()) {
      showToast({
        title: toast()?.title,
        description: toast()?.description,
        variant: toast()?.variant,
      });
    }
  });

  return (
    <>
      <MainHeader user={profile()} />
      {props.children}
    </>
  );
}
