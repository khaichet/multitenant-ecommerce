import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductSort } from "@/modules/products/ui/components/product-sort";
import { ProductListView } from "@/modules/products/ui/view/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
    params: Promise<{
        category: string;
    }>
    searchParams: Promise<SearchParams>
}

const Page = async ({ params, searchParams }: Props) => {

    const { category } = await params
    const { minPrice, maxPrice } = await searchParams

    const filters = await loadProductFilters(searchParams)
    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        category,
        limit: DEFAULT_LIMIT,
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={category} />
        </HydrationBoundary>
    );
}

export default Page;
