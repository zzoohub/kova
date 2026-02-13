"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Paintbrush,
  Search,
  Youtube,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/ui/command";
import { ROUTES } from "@/shared/config/routes";

const pipelineItems = [
  {
    name: "Weekly YouTube Breakdown",
    description: "Trending AI video analysis and script generation",
    icon: Youtube,
    path: ROUTES.PIPELINE_DETAIL("pip_01"),
  },
  {
    name: "LinkedIn Thought Leadership",
    description: "Research docs to LinkedIn post series",
    icon: Linkedin,
    path: ROUTES.PIPELINE_DETAIL("pip_02"),
  },
  {
    name: "X Thread Generator",
    description: "Blog posts to engaging X threads",
    icon: MessageSquare,
    path: ROUTES.PIPELINE_DETAIL("pip_05"),
  },
  {
    name: "Instagram Reel Series",
    description: "Short-form video scripts and captions",
    icon: Instagram,
    path: ROUTES.PIPELINE_DETAIL("pip_04"),
  },
];

const styleItems = [
  {
    name: "Tech Explainer Voice",
    description: "Conversational yet authoritative tone",
    icon: Paintbrush,
    path: ROUTES.STYLE_DETAIL("sty_01"),
  },
  {
    name: "Podcast Narrator",
    description: "Warm and storytelling-driven",
    icon: Paintbrush,
    path: ROUTES.STYLE_DETAIL("sty_02"),
  },
  {
    name: "LinkedIn Professional",
    description: "Insightful and polished",
    icon: Paintbrush,
    path: ROUTES.STYLE_DETAIL("sty_03"),
  },
];

const contentItems = [
  {
    name: "Why AI Agents Will Replace SaaS Dashboards",
    description: "X thread - Published",
    icon: FileText,
    path: ROUTES.CONTENT,
  },
  {
    name: "The Compound Content Framework",
    description: "LinkedIn post - Published",
    icon: FileText,
    path: ROUTES.CONTENT,
  },
  {
    name: "This Week in AI: Issue #47",
    description: "Newsletter - Published",
    icon: Mail,
    path: ROUTES.CONTENT,
  },
];

function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        onOpen();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}

function SearchResultsList({
  onSelect,
}: {
  onSelect: (path: string) => void;
}) {
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>

      <CommandGroup heading="Pipelines">
        {pipelineItems.map((item) => (
          <CommandItem
            key={item.name}
            onSelect={() => onSelect(item.path)}
            className="gap-3"
          >
            <item.icon className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{item.name}</span>
              <span className="text-muted-foreground text-xs">
                {item.description}
              </span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Styles">
        {styleItems.map((item) => (
          <CommandItem
            key={item.name}
            onSelect={() => onSelect(item.path)}
            className="gap-3"
          >
            <item.icon className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{item.name}</span>
              <span className="text-muted-foreground text-xs">
                {item.description}
              </span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Content">
        {contentItems.map((item) => (
          <CommandItem
            key={item.name}
            onSelect={() => onSelect(item.path)}
            className="gap-3"
          >
            <item.icon className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{item.name}</span>
              <span className="text-muted-foreground text-xs">
                {item.description}
              </span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
}

/**
 * Standalone search command dialog.
 * Opens via "/" keyboard shortcut. Use this when placing
 * the dialog without a visible trigger button.
 */
function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useSearchShortcut(() => setOpen(true));

  function handleSelect(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search pipelines, styles, and content"
      showCloseButton={false}
    >
      <CommandInput placeholder="Search pipelines, styles, content..." />
      <SearchResultsList onSelect={handleSelect} />
    </CommandDialog>
  );
}

/**
 * Search trigger button with integrated command dialog.
 * Renders a button (Search... + "/" kbd badge) that opens the
 * command palette. Also responds to "/" keyboard shortcut.
 * Place this in the top bar.
 */
function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useSearchShortcut(() => setOpen(true));

  function handleSelect(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground h-8 w-56 justify-start gap-2 text-sm font-normal"
        onClick={() => setOpen(true)}
        aria-label="Search pipelines, styles, and content"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          /
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search pipelines, styles, and content"
        showCloseButton={false}
      >
        <CommandInput placeholder="Search pipelines, styles, content..." />
        <SearchResultsList onSelect={handleSelect} />
      </CommandDialog>
    </>
  );
}

export { SearchCommand, SearchTrigger };
