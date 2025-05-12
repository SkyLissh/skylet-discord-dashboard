import { MetaProvider, Title } from "@solidjs/meta";
import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

import { Toaster } from "~/components/ui/toast";
import { m } from "~/paraglide/messages";

export default function Layout(props: RouteSectionProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: typeof window !== "undefined",
      },
    },
  });
  return (
    <MetaProvider>
      <Title>
        {m.skylet()} - {m.slogan()}
      </Title>
      <QueryClientProvider client={queryClient}>
        <Suspense>{props.children}</Suspense>
        <Toaster />
        <SolidQueryDevtools />
      </QueryClientProvider>
    </MetaProvider>
  );
}
