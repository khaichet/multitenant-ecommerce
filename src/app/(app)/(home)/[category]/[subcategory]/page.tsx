import { loadProductFilters } from "@/modules/products/search-params";
import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { ProductListView } from "@/modules/products/ui/view/product-list-view";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

interface Props {
    params: Promise<{
        subcategory: string;
    }>,
    searchParams: Promise<SearchParams>

}


const Page = async ({ params, searchParams }: Props) => {

    const { subcategory } = await params
    const { minPrice, maxPrice } = await searchParams

    const filters = await loadProductFilters(searchParams)
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
        ...filters

    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory} />
        </HydrationBoundary>
    );
}


export default Page;
