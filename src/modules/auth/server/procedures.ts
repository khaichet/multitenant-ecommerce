import { User } from './../../../payload-types';
import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers"
import { z } from "zod";
import { AUTH_COOKIE } from "../constants";
import { registerSchema, loginSchema } from "../schemas";
import { generateAuthCookie } from '../utils';

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = await ctx.db.auth({ headers })

        return session
    }),

    logout: baseProcedure.mutation(async () => {
        const cookies = await getCookies()
        cookies.delete(AUTH_COOKIE)
    }),

    register: baseProcedure
        .input(registerSchema).mutation(async ({ input, ctx }) => {

            const existingData = await ctx.db.find({
                collection: "users",
                limit: 1,
                where: {
                    username: {
                        equals: input.username,
                    }
                }
            })

            const existingUser = existingData.docs[0]

            if (existingUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "username already taken"
                })
            }

            await ctx.db.create({
                collection: "users",
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password
                }
            })
        }),

    login: baseProcedure
        .input(loginSchema).mutation(async ({ input, ctx }) => {
            const data = await ctx.db.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                },
            })

            if (!data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Failed to login"
                })
            }

            await generateAuthCookie({
                prefix: ctx.db.config.cookiePrefix,
                value: data.token
            })
            // const cookies = await getCookies()
            // cookies.set({
            //     name: `${ctx.db.config.cookiePrefix}-token`,
            //     value: data.token,
            //     httpOnly: true,
            //     path: "/",
            //     // sameSite: "none",
            //     // secure: true

            // })

            return data
        })
})