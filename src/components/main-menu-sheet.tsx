import { m } from "~/paraglide/messages";

import { LanguageDropdown } from "~/components/language-dropdown";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

import BellDot from "~icons/lucide/bell-dot";
import ChevronDown from "~icons/lucide/chevron-down";
import Music from "~icons/lucide/music";
import User from "~icons/lucide/user";
import Wrench from "~icons/lucide/wrench";
import Discord from "~icons/simple-icons/discord";

export function MainMenuSheet() {
  return (
    <SheetContent position="left" class="flex flex-col p-0">
      <SheetHeader class="border-border border-b p-6">
        <SheetTitle class="flex items-center gap-4">
          <img src="/logo.png" alt="SkyLet" class="size-10 rounded-full" />
          <p class="text-lg font-semibold tracking-wide md:text-xl">{m.skylet()}</p>
        </SheetTitle>
      </SheetHeader>
      <div class="flex flex-1 flex-col gap-4 px-6 py-4">
        <Button variant="ghost" class="w-full justify-start">
          {m.commands()}
        </Button>
        <Collapsible>
          <CollapsibleTrigger
            as={Button}
            variant="ghost"
            class="group w-full justify-between"
          >
            {m.modules()}
            <ChevronDown class="size-4 transition-transform duration-300 group-data-expanded:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul class="flex flex-col gap-2">
              <li>
                <Button
                  variant="ghost"
                  class="text-muted-foreground w-full justify-start"
                >
                  <BellDot />
                  {m.twitch_alerts()}
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  class="text-muted-foreground w-full justify-start"
                >
                  <Music />
                  {m.music()}
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  class="text-muted-foreground w-full justify-start"
                >
                  <User />
                  {m.welcome_messages()}
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  class="text-muted-foreground w-full justify-start"
                >
                  <Wrench />
                  {m.moderation()}
                </Button>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
        <LanguageDropdown class="mt-auto" />
      </div>
      <SheetFooter class="flex flex-col gap-2 px-6 py-4">
        <Separator />
        <Button>
          <Discord />
          {m.login()}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
