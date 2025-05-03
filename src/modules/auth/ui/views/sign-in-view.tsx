"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema } from "../../schemas"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { error } from "console"
import { useRouter } from "next/navigation"
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});


export const SignInView = () => {

    const router = useRouter()

    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const login = useMutation(trpc.auth.login.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/")
        }
    }))
    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },

    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values)
    }


    return (

        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4f4f0]  h-screen w-full  lg:col-span-3 overflow-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16" >
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/">
                                <span className={cn("text-2xl font-semibold", poppins.className)}>

                                    Fim
                                </span>
                            </Link>
                            <Button
                                asChild variant="ghost" size="sm" className="text-base border-none underline">
                                <Link prefetch href="/sign-up">
                                    Sign up</Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            WelCome back to So Far Away.
                        </h1>

                        <FormField name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base"> Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}>

                        </FormField>
                        <FormField name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                        </FormField>

                        <Button disabled={login.isPending} type="submit" size="lg" variant="elevated" className="bg-black text-white hover:bg-green-800 hover:text-primary ">
                            Login
                        </Button>
                    </form>


                </Form>
            </div>

            <div
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
                className="h-screen w-full lg:col-span-2 hidden lg:block">
            </div>
        </div >
    )
}