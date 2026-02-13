"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UserCircle, Plus, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { ROUTES } from "@/shared/config/routes";
import { mockBrands } from "@/shared/mock/brands";
import { BrandCard } from "@/entities/brand";
import type { Brand } from "@/entities/brand";

type SortOption = "recent" | "most_used" | "alphabetical";

export function BrandsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  const brands: Brand[] = mockBrands;

  const filteredBrands = useMemo(() => {
    let result = [...brands];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((b) => b.name.toLowerCase().includes(query));
    }

    switch (sort) {
      case "recent":
        result.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case "most_used":
        result.sort((a, b) => b.pipelineCount - a.pipelineCount);
        break;
      case "alphabetical":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [brands, search, sort]);

  if (brands.length === 0) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Brand Library"
          titleKo="\uBE0C\uB79C\uB4DC \uB77C\uC774\uBE0C\uB7EC\uB9AC"
          action={
            <Button asChild>
              <Link href={ROUTES.BRAND_NEW}>
                <Plus />
                Create New Brand
              </Link>
            </Button>
          }
        />
        <EmptyState
          icon={UserCircle}
          title="No brands yet"
          titleKo="\uC544\uC9C1 \uBE0C\uB79C\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"
          description="Brands define your identity, voice, and vocabulary. Each brand can have its own tone, audience, and connected platforms."
          descriptionKo="\uBE0C\uB79C\uB4DC\uB294 \uC815\uCCB4\uC131, \uBAA9\uC18C\uB9AC, \uC5B4\uD718\uB97C \uC815\uC758\uD569\uB2C8\uB2E4. \uAC01 \uBE0C\uB79C\uB4DC\uB9C8\uB2E4 \uACE0\uC720\uD55C \uD1A4, \uD0C0\uAC9F \uC624\uB514\uC5B8\uC2A4, \uC5F0\uACB0\uB41C \uD50C\uB7AB\uD3FC\uC744 \uAC00\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
          action={
            <Button asChild>
              <Link href={ROUTES.BRAND_NEW}>Create Your First Brand</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Brand Library"
        titleKo="\uBE0C\uB79C\uB4DC \uB77C\uC774\uBE0C\uB7EC\uB9AC"
        action={
          <Button asChild>
            <Link href={ROUTES.BRAND_NEW}>
              <Plus />
              Create New Brand
            </Link>
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="most_used">Most Used</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card grid or empty results */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search
            className="mb-4 size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-foreground">
            No brands found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}
