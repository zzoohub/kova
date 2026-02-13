"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MoreHorizontal,
  Copy,
  Star,
  Trash2,
  AtSign,
  Youtube,
  Instagram,
  Linkedin,
  Globe,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ROUTES } from "@/shared/config/routes";
import { mockBrands } from "@/shared/mock/brands";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  twitter: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  wordpress: Globe,
};

const PERSPECTIVES = [
  { value: "first_person", label: "First person (I/me)" },
  { value: "first_person_plural", label: "First person plural (we/us)" },
  { value: "second_person", label: "Second person (you)" },
  { value: "third_person", label: "Third person (they/the brand)" },
  { value: "mixed", label: "Mixed" },
];

const EMOJI_OPTIONS = [
  { value: "none", label: "None" },
  { value: "minimal", label: "Minimal" },
  { value: "moderate", label: "Moderate" },
  { value: "frequent", label: "Frequent" },
] as const;

type FormFieldProps = {
  label: string;
  labelKo: string;
  helperText?: string;
  children: React.ReactNode;
};

function FormField({ label, labelKo, helperText, children }: FormFieldProps) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        <span className="ml-1 text-xs text-muted-foreground" lang="ko">
          / {labelKo}
        </span>
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, {
            id,
          })
        : children}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

type BrandFormContentProps = {
  id?: string;
};

export function BrandFormPage({ id }: BrandFormContentProps) {
  const isEdit = Boolean(id);
  const existingBrand = id ? mockBrands.find((b) => b.id === id) : undefined;

  const [name, setName] = React.useState(existingBrand?.name ?? "");
  const [description, setDescription] = React.useState(
    existingBrand?.description ?? ""
  );
  const [voiceTone, setVoiceTone] = React.useState(
    existingBrand?.voiceTone ?? ""
  );
  const [targetAudience, setTargetAudience] = React.useState(
    existingBrand?.targetAudience ?? ""
  );
  const [perspective, setPerspective] = React.useState(
    existingBrand?.perspective ?? "first_person"
  );
  const [wordsToUse, setWordsToUse] = React.useState(
    existingBrand?.wordsToUse.join(", ") ?? ""
  );
  const [wordsToAvoid, setWordsToAvoid] = React.useState(
    existingBrand?.wordsToAvoid.join(", ") ?? ""
  );
  const [emojiUsage, setEmojiUsage] = React.useState(
    existingBrand?.emojiUsage ?? "minimal"
  );
  const [guidelines, setGuidelines] = React.useState(
    existingBrand?.guidelines ?? ""
  );

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link + title */}
      <div className="mb-8">
        <Link
          href={ROUTES.BRANDS}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Brands
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isEdit ? (existingBrand?.name ?? "Edit Brand") : "Create New Brand"}
            </h1>
            <p className="text-sm text-muted-foreground" lang="ko">
              {isEdit ? "\uBE0C\uB79C\uB4DC \uC218\uC815" : "\uC0C8 \uBE0C\uB79C\uB4DC \uB9CC\uB4E4\uAE30"}
            </p>
          </div>
          {isEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="size-4" />
                  Set as Default
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Form sections */}
      <div className="flex flex-col gap-8">
        {/* IDENTITY */}
        <section className="flex flex-col gap-5">
          <SectionHeader>Identity</SectionHeader>

          <FormField
            label="Brand Name"
            labelKo="\uBE0C\uB79C\uB4DC \uC774\uB984"
            helperText="This name will be used across all published content."
          >
            <Input
              placeholder="Your name or brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField
            label="Description"
            labelKo="\uC124\uBA85"
            helperText="A brief 1-2 sentence description of your brand."
          >
            <Textarea
              placeholder="Brief description (1-2 sentences)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </FormField>

          <FormField
            label="Voice & Tone"
            labelKo="\uC74C\uC131 & \uD1A4"
            helperText="Describe how your content should sound. AI will match this style."
          >
            <Textarea
              placeholder="e.g., Professional but approachable, uses analogies"
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField
            label="Target Audience"
            labelKo="\uD0C0\uAC9F \uC624\uB514\uC5B8\uC2A4"
            helperText="Who is your content for? Be specific about demographics and interests."
          >
            <Textarea
              placeholder="e.g., Tech professionals aged 25-45"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField label="Perspective" labelKo="\uAD00\uC810">
            <Select value={perspective} onValueChange={setPerspective}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERSPECTIVES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </section>

        {/* VOCABULARY */}
        <section className="flex flex-col gap-5">
          <SectionHeader>Vocabulary</SectionHeader>

          <FormField
            label="Words to Use"
            labelKo="\uC0AC\uC6A9\uD560 \uB2E8\uC5B4"
            helperText="Preferred vocabulary that reflects your brand voice."
          >
            <Textarea
              placeholder="e.g., innovative, practical, actionable"
              value={wordsToUse}
              onChange={(e) => setWordsToUse(e.target.value)}
              rows={2}
            />
          </FormField>

          <FormField
            label="Words to Avoid"
            labelKo="\uD53C\uD574\uC57C \uD560 \uB2E8\uC5B4"
            helperText="Words or phrases that don't fit your brand."
          >
            <Textarea
              placeholder="e.g., synergy, leverage, disruptive"
              value={wordsToAvoid}
              onChange={(e) => setWordsToAvoid(e.target.value)}
              rows={2}
            />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Emoji Usage
              <span className="ml-1 text-xs text-muted-foreground" lang="ko">
                / \uC774\uBAA8\uC9C0 \uC0AC\uC6A9
              </span>
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Emoji usage">
              {EMOJI_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    emojiUsage === option.value
                      ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary"
                      : "border-border text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="emoji-usage"
                    value={option.value}
                    checked={emojiUsage === option.value}
                    onChange={() => setEmojiUsage(option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <FormField
            label="Content Guidelines"
            labelKo="\uCF58\uD150\uCE20 \uAC00\uC774\uB4DC\uB77C\uC778"
            helperText="Topics to avoid, required disclaimers, or other content rules."
          >
            <Textarea
              placeholder="Topics to avoid, required disclaimers..."
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              rows={3}
            />
          </FormField>
        </section>

        {/* CONNECTED PLATFORMS */}
        <section className="flex flex-col gap-5">
          <SectionHeader>Connected Platforms</SectionHeader>

          {existingBrand && existingBrand.connectedPlatforms.length > 0 ? (
            <div className="flex flex-col gap-2">
              {existingBrand.connectedPlatforms.map((p) => {
                const Icon = PLATFORM_ICONS[p.platformId] ?? Globe;
                return (
                  <div
                    key={p.platformId}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {p.accountName}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No platforms connected yet.
            </p>
          )}

          <Button variant="outline" size="sm" className="w-fit">
            <Plus className="size-4" />
            Link Platform Account
          </Button>
        </section>
      </div>

      {/* Bottom action bar */}
      <div className="mt-10 flex items-center justify-end gap-3 border-t pt-6">
        <Button variant="outline" asChild>
          <Link href={ROUTES.BRANDS}>Cancel</Link>
        </Button>
        <Button>{isEdit ? "Save Changes" : "Save Brand"}</Button>
      </div>
    </div>
  );
}
