import { A } from "@solidjs/router";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { Button } from "~/components/ui/button";

import Wrench from "~icons/lucide/wrench";
import Discord from "~icons/simple-icons/discord";

export default function Page() {
  return (
    <main class="container p-4">
      <div class="my-8 flex flex-col-reverse items-center justify-evenly gap-12 md:flex-row lg:my-32">
        <div class="flex flex-col gap-4">
          <h1 class="text-center text-4xl font-bold whitespace-pre-line lg:text-start">
            {m.slogan()}
          </h1>
          <p class="text-muted-foreground text-center text-lg lg:text-start">
            {m.features()}
          </p>
          <div class="flex flex-col items-center gap-4 md:flex-row">
            <Button class="w-full md:w-auto [&_svg]:size-6">
              <Discord />
              {m.add_to_discord()}
            </Button>
            <Button
              as={A}
              href={localizeHref("/dashboard")}
              variant="outline"
              class="w-full md:w-auto [&_svg]:size-6"
            >
              <Wrench />
              {m.dashboard()}
            </Button>
          </div>
        </div>
        <div class="relative">
          <div class="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-400/50 to-sky-500/50 blur-xl" />
          <img
            src="/logo.png"
            alt="SkyLet"
            class="relative z-10 aspect-square size-64 rounded-full md:size-96"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}
