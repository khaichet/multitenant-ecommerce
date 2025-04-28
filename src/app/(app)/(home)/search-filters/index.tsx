"use client"

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categories";
import { SearchInPut } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";


export const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const params = useParams()

  const categoryParam = params.category as string | undefined
  const activeCategory = categoryParam || "all"

  const activeCategoryData = data.find((category) => category.slug === activeCategory)
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR

  const activeCategoryName = activeCategoryData?.name || null
  const activeSubcategory = params.subcategory as string | undefined
  const activeSubcategoryName = activeCategoryData?.subcategories?.find(
    (subcategory) => subcategory.slug === activeSubcategory)?.name || null


  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}>
      <SearchInPut disabled />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategory}
      />
    </div>
  );
};

export const SearchFiltersLoading = () => {
  return (
    <div style={{
      backgroundColor: "#F5F5F5"
    }}
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <div className="hidden lg:block">
        <div className="h-18" />
      </div>

    </div>
  )
}
