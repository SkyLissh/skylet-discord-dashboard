import { A } from "@solidjs/router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

import { m } from "~/paraglide/messages";

import BellDot from "~icons/lucide/bell-dot";
import Music from "~icons/lucide/music";
import User from "~icons/lucide/user";
import Wrench from "~icons/lucide/wrench";

export function FeaturesMenu(props: { orientation: "horizontal" | "vertical" }) {
  return (
    <NavigationMenu orientation={props.orientation}>
      <NavigationMenuTrigger as={A} href="#commands">
        {m.commands()}
      </NavigationMenuTrigger>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          {m.modules()}
          <NavigationMenuIcon />
        </NavigationMenuTrigger>

        <NavigationMenuContent class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
          <NavigationMenuLink as={A} href="#modules">
            <NavigationMenuLabel class="flex items-center gap-2">
              <BellDot />
              {m.twitch_alerts()}
            </NavigationMenuLabel>
            <NavigationMenuDescription>
              {m.twitch_alerts_description()}
            </NavigationMenuDescription>
          </NavigationMenuLink>

          <NavigationMenuLink as={A} href="#modules">
            <NavigationMenuLabel class="flex items-center gap-2">
              <Music />
              {m.music()}
            </NavigationMenuLabel>
            <NavigationMenuDescription>{m.music_description()}</NavigationMenuDescription>
          </NavigationMenuLink>

          <NavigationMenuLink as={A} href="#modules">
            <NavigationMenuLabel class="flex items-center gap-2">
              <Wrench />
              {m.moderation()}
            </NavigationMenuLabel>
            <NavigationMenuDescription>
              {m.moderation_description()}
            </NavigationMenuDescription>
          </NavigationMenuLink>

          <NavigationMenuLink as={A} href="#modules">
            <NavigationMenuLabel class="flex items-center gap-2">
              <User />
              {m.welcome_messages()}
            </NavigationMenuLabel>
            <NavigationMenuDescription>
              {m.welcome_messages_description()}
            </NavigationMenuDescription>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
