import type { RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { createAsync } from "@solidjs/router";

import { MainHeader } from "~/components/main-header";

import { getMaybeSession } from "~/lib/queries/auth";

export const route: RouteDefinition = {
  preload: () => getMaybeSession(),
};

export default function Layout(props: RouteSectionProps) {
  const session = createAsync(() => getMaybeSession(), { deferStream: true });

  return (
    <>
      <MainHeader user={session()?.user} />
      {props.children}
    </>
  );
}
