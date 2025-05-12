import { A } from "@solidjs/router";
import { Match, Switch } from "solid-js";

import { m } from "~/paraglide/messages";
import { localizeHref } from "~/paraglide/runtime";

import { FeaturesMenu } from "~/components/features-menu";
import { LanguageDropdown } from "~/components/language-dropdown";
import { MainMenuSheet } from "~/components/main-menu-sheet";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";

import { auth, signIn } from "~/lib/auth-client";

import type { DiscordProfile } from "~/schemas/discord-profile";

import ChevronDown from "~icons/lucide/chevron-down";
import LogOut from "~icons/lucide/log-out";
import Menu from "~icons/lucide/menu";
import UserIcon from "~icons/lucide/user";
import Wrench from "~icons/lucide/wrench";
import Discord from "~icons/simple-icons/discord";

export function MainHeader(props: { user: DiscordProfile | undefined }) {
  return (
    <Sheet defaultOpen={false}>
      <MainMenuSheet />
      <header class="border-border border-b p-4">
        <nav class="container flex items-center justify-between ps-0 pe-0">
          <ul class="flex items-center gap-4">
            <li>
              <A href={localizeHref("/")} class="flex items-center gap-4">
                <img src="/logo.png" alt="SkyLet" class="size-10 rounded-full" />
                <p class="text-lg font-semibold tracking-wide md:text-xl">{m.skylet()}</p>
              </A>
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
            <Switch>
              <Match when={!props.user}>
                <Button variant="outline" onClick={signIn}>
                  <Discord />
                  {m.login()}
                </Button>
              </Match>
              <Match when={props.user}>
                {(user) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger class="flex items-center gap-2 hover:cursor-pointer">
                      <img
                        src={user().avatar_url}
                        alt={user().name}
                        class="size-10 rounded-full"
                        loading="lazy"
                      />
                      <p class="text-sm">{user().name}</p>
                      <ChevronDown class="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="min-w-52">
                      <div class="flex flex-col gap-2 p-2">
                        <p>{user().name}</p>
                        <span class="text-muted-foreground text-xs">
                          {m.hi({ username: `@${user().username}` })}
                        </span>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserIcon class="size-4" />
                        {m.profile()}
                      </DropdownMenuItem>
                      <DropdownMenuItem as={A} href={localizeHref("/dashboard")}>
                        <Wrench class="size-4" />
                        {m.dashboard()}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => auth.signOut()}>
                        <LogOut />
                        {m.logout()}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Match>
            </Switch>
          </ul>
        </nav>
      </header>
    </Sheet>
  );
}
