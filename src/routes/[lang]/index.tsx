import { Title } from "@solidjs/meta";

import { m } from "~/paraglide/messages";

import { Button } from "~/components/ui/button";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";

import { FeaturesMenu } from "~/components/features-menu";
import { LanguageDropdown } from "~/components/language-dropdown";
import { MainMenuSheet } from "~/components/main-menu-sheet";

import Menu from "~icons/lucide/menu";
import Wrench from "~icons/lucide/wrench";
import Discord from "~icons/simple-icons/discord";

export default function Home() {
  return (
    <Sheet defaultOpen={false}>
      <Title>
        {m.skylet()} - {m.slogan()}
      </Title>
      <MainMenuSheet />
      <header class="border-border border-b p-4">
        <nav class="container flex items-center justify-between ps-0 pe-0">
          <ul class="flex items-center gap-4">
            <li>
              <div class="flex items-center gap-4">
                <img src="/logo.png" alt="SkyLet" class="size-10 rounded-full" />
                <p class="text-lg font-semibold tracking-wide md:text-xl">{m.skylet()}</p>
              </div>
            </li>
            <li class="hidden md:block">
              <FeaturesMenu orientation="horizontal" />
            </li>
          </ul>
          <ul class="flex items-center gap-4">
            <LanguageDropdown class="hidden md:inline-flex" />
            <SheetTrigger class="md:hidden" as={Button} variant="outline" size="icon">
              <Menu />
            </SheetTrigger>
            <Button variant="outline">
              <Discord />
              {m.login()}
            </Button>
          </ul>
        </nav>
      </header>
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
              <Button variant="outline" class="w-full md:w-auto [&_svg]:size-6">
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
    </Sheet>
  );
}
