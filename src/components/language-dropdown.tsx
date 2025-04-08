import { Index } from "solid-js";

import { m } from "~/paraglide/messages";
import { getLocale, Locale, locales, setLocale } from "~/paraglide/runtime";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import ChevronDown from "~icons/lucide/chevron-down";

export function LanguageDropdown(props: { class?: string }) {
  const LANGUAGE_NAMES: Record<Locale, string> = {
    en: "English",
    es: "Español",
  };

  const FLAG_CODES: Record<Locale, string> = {
    en: "us",
    es: "mx",
  };

  const currentLocale = getLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button} variant="ghost" class={props.class}>
        <img
          src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${FLAG_CODES[currentLocale]}.svg`}
          alt={LANGUAGE_NAMES[currentLocale]}
          class="size-6 rounded-full"
          loading="lazy"
        />
        {LANGUAGE_NAMES[currentLocale]}
        <ChevronDown class="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-48">
        <DropdownMenuLabel>{m.select_language()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Index each={locales}>
          {(locale) => (
            <DropdownMenuItem onClick={() => setLocale(locale())}>
              <img
                src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${FLAG_CODES[locale()]}.svg`}
                alt={LANGUAGE_NAMES[locale()]}
                class="size-6 rounded-full"
                loading="lazy"
              />
              {LANGUAGE_NAMES[locale()]}
            </DropdownMenuItem>
          )}
        </Index>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
