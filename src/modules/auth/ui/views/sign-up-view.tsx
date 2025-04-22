"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerSchema } from "../schemas"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { error } from "console"
import { useRouter } from "next/navigation"
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});


export const SignUpView = () => {

    const router = useRouter()

    const trpc = useTRPC()
    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            router.push("/")
        }
    }))
    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },

    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

    const username = form.watch("username");
    const usernameErrors = form.formState.errors.username;

    const showPreview = username && !usernameErrors

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
                                <Link prefetch href="/sign-in">
                                    Sign in</Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            Join over 1,340 creators earnning money on

                        </h1>
                        <FormField name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base"> UserName</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription className={cn("hidden", showPreview && "block")}>
                                    Your store will be avaiable at&nbsp;
                                    <strong>{username}</strong>.shop.com
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}>

                        </FormField>
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

                        <Button disabled={register.isPending} type="submit" size="lg" variant="elevated" className="bg-black text-white hover:bg-green-800 hover:text-primary ">
                            Create Account
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
                background column
            </div>
        </div >
    )
}