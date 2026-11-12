// A sidebar is named in the app's words, and so are the button that opens it on a phone and the one that closes it.
import type { ComponentProps, ReactNode } from "react";
import { expectTypeOf, it } from "vitest";
import type { Sidebar, SidebarTrigger } from "../src/components/sidebar.js";

type SidebarProps = ComponentProps<typeof Sidebar>;
type TriggerProps = ComponentProps<typeof SidebarTrigger>;

it("asks a sidebar for its name and its close label", () => {
  expectTypeOf<{
    closeLabel: string;
    children: ReactNode;
  }>().not.toExtend<SidebarProps>();
  expectTypeOf<{
    "aria-label": string;
    children: ReactNode;
  }>().not.toExtend<SidebarProps>();
  expectTypeOf<{
    "aria-label": string;
    closeLabel: string;
    children: ReactNode;
  }>().toExtend<SidebarProps>();
  expectTypeOf<{
    "aria-labelledby": string;
    closeLabel: string;
    children: ReactNode;
  }>().toExtend<SidebarProps>();
});

it("asks the trigger for its name", () => {
  expectTypeOf<object>().not.toExtend<TriggerProps>();
  expectTypeOf<{ "aria-label": string }>().toExtend<TriggerProps>();
});
