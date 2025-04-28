"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  data?: CategoriesGetManyOutput[1]
}
export const SearchInPut = ({ disabled }: Props) => {

  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder=" Search Products "
          disabled={disabled}
        />
      </div>
      <Button variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}>
        <ListFilterIcon />
      </Button>

      {session.data?.user && (

        <Button asChild variant="elevated">
          <Link href="/library">
            <BookmarkCheckIcon className="mr-2" />
            Library
          </Link>
        </Button>
      )}
    </div >
  );
};
