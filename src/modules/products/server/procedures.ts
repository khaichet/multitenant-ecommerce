

import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from 'payload';
import { object, z } from "zod";
import { sortValues } from "../search-params";
import { Sort } from "payload";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.
        input(
            z.object({
                category: z.string().nullable().optional(),
                minPrice: z.string().nullable().optional(),
                maxPrice: z.string().nullable().optional(),
                tags: z.array(z.string()).nullable().optional(),
                sort: z.enum(sortValues).nullable().optional()

            }),
        )
        .query(async ({ ctx, input }) => {

            const where: Where = {}

            let sort: Sort = "-createdAt"

            if (input.sort === "curated") {
                sort = "-createdAt"
            }

            if (input.sort === "hot_and_new") {
                sort = "+createdAt"
            }

            if (input.sort === "trending") {
                sort = "-createdAt"
            }

            if (input.minPrice) {
                where.price = {
                    ...where.price,
                    greater_than_equal: input.minPrice
                }
            }

            if (input.maxPrice) {
                where.price = {
                    ...where.price,
                    greater_than_equal: input.maxPrice
                }
            }

            if (input.category) {

                const categoriesData = await ctx.db.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category
                        }
                    }
                })

                const formatedData = categoriesData.docs.map((doc) => ({
                    ...doc,
                    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                        ...(doc as Category),
                        subcategories: undefined,
                    })),
                }));

                const subcategoriesSlugs = []

                const parentCategory = formatedData[0]

                if (parentCategory) {
                    subcategoriesSlugs.push(
                        ...parentCategory.subcategories.map((subcategory) => subcategory.slug)

                    )
                }

                if (parentCategory) {
                    where["category.slug"] = {
                        in: [parentCategory.slug, ...subcategoriesSlugs]
                    }
                }
            }
            if (input.tags && input.tags.length > 0) {
                where["tags.name"] = {
                    in: input.tags
                }
            }
            const data = await ctx.db.find({
                collection: "products",
                depth: 1,
                where,
                sort,
            });

            return data
        })
})