import {
  Component,
  JSX,
  ParentProps,
  splitProps,
  ValidComponent,
  VoidProps,
} from "solid-js";

import { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as PopoverPrimitive from "@kobalte/core/popover";
import * as CommandPrimitive from "cmdk-solid";

import { cn } from "~/lib/utils";

import { buttonVariants } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

import ChevronsUpDown from "~icons/lucide/chevrons-up-down";

// export function Combobox() {
//   const [open, setOpen] = createSignal(false);

//   return (
//     <Popover open={open()} onOpenChange={setOpen}>
//       <PopoverTrigger
//         as={Button<"button">}
//         variant="outline"
//         role="combobox"
//         aria-expanded={open()}
//         class="bg-popover w-full justify-between font-normal"
//       >
//         Select something
//         <ChevronsUpDown class="opacity-50" />
//       </PopoverTrigger>
//       <PopoverContent class="w-(--kb-popper-anchor-width) p-0">
//         <Command>
//           <CommandInput placeholder="Search..." />
//           <CommandList>
//             <CommandEmpty>No results found.</CommandEmpty>
//             <CommandGroup>
//               <CommandItem value="1">Item 1</CommandItem>
//               <CommandItem value="2">Item 2</CommandItem>
//               <CommandItem value="3">Item 3</CommandItem>
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

const Combobox: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
  return <Popover gutter={4} {...props} />;
};

type ComboboxTriggerProps<T extends ValidComponent = "button"> =
  PopoverPrimitive.PopoverTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element | undefined;
  };

const ComboboxTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ComboboxTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as ComboboxTriggerProps, [
    "class",
    "children",
  ]);

  return (
    <PopoverTrigger
      class={cn(
        buttonVariants({ variant: "outline" }),
        "bg-popover h-11 w-full justify-between font-normal",
        local.class
      )}
      {...others}
    >
      {local.children}
      <ChevronsUpDown class="opacity-50" />
    </PopoverTrigger>
  );
};

const ComboboxContent: Component<ParentProps<CommandPrimitive.CommandRootProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <PopoverContent class={cn("w-(--kb-popper-anchor-width) p-0", local.class)}>
      <Command {...others} />
    </PopoverContent>
  );
};

const ComboboxInput: Component<VoidProps<CommandPrimitive.CommandInputProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandInput class={local.class} {...others} />;
};

const ComboboxList: Component<ParentProps<CommandPrimitive.CommandListProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandList class={local.class} {...others} />;
};

const ComboboxGroup: Component<ParentProps<CommandPrimitive.CommandGroupProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandGroup class={local.class} {...others} />;
};

const ComboboxItem: Component<ParentProps<CommandPrimitive.CommandItemProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandItem class={local.class} {...others} />;
};

const ComboboxEmpty: Component<ParentProps<CommandPrimitive.CommandEmptyProps>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandEmpty class={local.class} {...others} />;
};

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
};
