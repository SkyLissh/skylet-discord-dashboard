import { MetaProvider, Title } from "@solidjs/meta";
import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

import { m } from "~/paraglide/messages";

export default function Layout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>
        {m.skylet()} - {m.slogan()}
      </Title>
      <Suspense>{props.children}</Suspense>
    </MetaProvider>
  );
}
