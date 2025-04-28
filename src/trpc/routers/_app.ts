import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { authRouter } from '@/modules/auth/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { tagsRouter } from '@/modules/tags/server/procedures';


export const appRouter = createTRPCRouter({
    auth: authRouter,
    products: productsRouter,
    tags: tagsRouter,
    categories: categoriesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;