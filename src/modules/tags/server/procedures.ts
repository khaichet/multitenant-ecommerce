

import { DEFAULT_LIMIT } from "@/constants";
import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { resourceLimits } from "node:worker_threads";
import type { Where } from 'payload';
import { object, z } from "zod";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure.
        input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),

            }),
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.find({
                collection: "tags",
                page: input.cursor,
                limit: input.limit,
            });

            return data
        })
})