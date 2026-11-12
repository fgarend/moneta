// The app's main navigation, at the start of its screen: a named nav of lists of links, the current page marked for
// every reader, and on a phone a sheet that the app's button opens. Our own, under shadcn's part names.
// docs/decisions/components.md says why it is so.
import { cn } from "cn";
import { MenuIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { Link as LinkPrimitive } from "react-aria-components";
import { Button } from "#components/button";
import { Sheet } from "#components/sheet";

// Whether its sheet is open on a phone; below Tailwind's md the wide sidebar hides itself, and only the trigger, seen
// there alone, opens the sheet, so nothing here needs to know the screen.
type SidebarState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

function useSidebar(): SidebarState {
  const state = useContext(SidebarContext);
  if (state === null) {
    throw new Error("Sidebar: its parts need a SidebarProvider around them.");
  }
  return state;
}

// Around the sidebar and the button that opens it on a phone, so they share whether its sheet is open.
function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const state = useMemo(() => ({ isOpen, setOpen }), [isOpen]);
  return (
    <SidebarContext.Provider value={state}>{children}</SidebarContext.Provider>
  );
}

// Its name, in the app's words, which its sheet takes on a phone.
type SidebarName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

// The dark surface, its glow, and the ring drawn on it, as the theme asks of an area with a surface of its own.
const surface =
  "flex h-full w-64 flex-col sidebar-glow text-sidebar-foreground [--ring:var(--sidebar-ring)]";

function Sidebar({
  closeLabel,
  className,
  children,
  ...name
}: SidebarName & {
  // The name of the button that closes its sheet on a phone.
  closeLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const { isOpen, setOpen } = useSidebar();
  return (
    <>
      <nav
        {...name}
        className={cn(surface, "hidden shrink-0 md:flex", className)}
        data-slot="sidebar"
      >
        {children}
      </nav>
      <Sheet
        {...name}
        className="w-64 border-r-0 bg-sidebar [--accent-foreground:var(--sidebar-accent-foreground)] [--accent:var(--sidebar-accent)] [--foreground:var(--sidebar-accent-foreground)] [--ring:var(--sidebar-ring)]"
        closeLabel={closeLabel}
        isOpen={isOpen}
        onOpenChange={setOpen}
        side="left"
      >
        <nav {...name} className={cn(surface, className)} data-slot="sidebar">
          {children}
        </nav>
      </Sheet>
    </>
  );
}

// The button that opens the sidebar on a phone, where the app puts it, as its top bar; out of sight on a wider screen.
function SidebarTrigger({
  "aria-label": ariaLabel,
  className,
}: {
  "aria-label": string;
  className?: string;
}) {
  const { isOpen, setOpen } = useSidebar();
  return (
    <Button
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      className={cn("md:hidden", className)}
      data-slot="sidebar-trigger"
      onPress={() => setOpen(!isOpen)}
      size="icon"
      variant="ghost"
    >
      <MenuIcon />
    </Button>
  );
}

// What the app puts above its sections, as its brand.
function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-3", className)}
      data-slot="sidebar-header"
      {...props}
    />
  );
}

// The sections, which scroll on their own when they do not fit.
function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-2",
        className,
      )}
      data-slot="sidebar-content"
      {...props}
    />
  );
}

// What the app puts below its sections, as the person signed in.
function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-3", className)}
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

// A section's label names its list.
const GroupContext = createContext<string | undefined>(undefined);

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  const labelId = useId();
  return (
    <GroupContext.Provider value={labelId}>
      <div
        className={cn("flex flex-col", className)}
        data-slot="sidebar-group"
        {...props}
      />
    </GroupContext.Provider>
  );
}

function SidebarGroupLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-3 pb-1 text-xs font-medium text-sidebar-muted-foreground",
        className,
      )}
      data-slot="sidebar-group-label"
      id={useContext(GroupContext)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      aria-labelledby={useContext(GroupContext)}
      className={cn("flex flex-col gap-1", className)}
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={className} data-slot="sidebar-menu-item" {...props} />;
}

// A link, through the app's router, with its icon first. The current page takes the background, a bolder text, a
// gold icon and a bar at its start, a border, so forced colours keep it; its padding gives up the bar's width.
function SidebarMenuButton({
  isActive = false,
  className,
  onPress,
  ...props
}: Omit<ComponentProps<typeof LinkPrimitive>, "className"> & {
  // The page shown now, which screen readers hear as the current page.
  isActive?: boolean;
  className?: string;
}) {
  const { setOpen } = useSidebar();
  return (
    <LinkPrimitive
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-9 items-start gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        // An icon takes its colours outside forced colours only, so there it follows its text.
        "[&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 not-forced-colors:[&>svg]:text-sidebar-muted-foreground",
        "aria-[current=page]:border-s-4 aria-[current=page]:border-sidebar-accent-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:ps-2 aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground not-forced-colors:aria-[current=page]:[&>svg]:text-sidebar-primary",
        className,
      )}
      data-slot="sidebar-menu-button"
      onPress={(event) => {
        // A followed link closes the sheet on a phone, as the page under it changes; with none open, nothing.
        setOpen(false);
        onPress?.(event);
      }}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
};
