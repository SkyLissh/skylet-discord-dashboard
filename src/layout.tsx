import { MetaProvider, Title } from "@solidjs/meta";
import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

export default function Layout(props: RouteSectionProps) {
  return (
    <MetaProvider>
      <Title>SolidStart - Basic</Title>
      <Suspense>{props.children}</Suspense>
    </MetaProvider>
  );
}
