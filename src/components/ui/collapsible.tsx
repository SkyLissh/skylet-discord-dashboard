import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { PolymorphicProps } from "@kobalte/core";
import * as CollapsiblePrimitive from "@kobalte/core/collapsible";
import { cn } from "~/lib/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

type CollapsibleContentProps<T extends ValidComponent = "div"> =
  CollapsiblePrimitive.CollapsibleContentProps<T> & {
    class?: string | undefined;
  };

const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsibleContentProps<T>>
) => {
  const [, rest] = splitProps(props as CollapsibleContentProps, ["class"]);

  return (
    <CollapsiblePrimitive.Content
      class={cn(
        "data-expanded:animate-collapsible-down animate-collapsible-up overflow-hidden",
        props.class
      )}
      {...rest}
    />
  );
};

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
