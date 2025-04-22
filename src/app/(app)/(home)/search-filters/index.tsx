"use client"

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categories";
import { SearchInPut } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";


export const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInPut />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>

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
