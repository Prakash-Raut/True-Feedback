"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signinSchema } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function SignIn() {
	const { toast } = useToast();
	const router = useRouter();

	// zod implementation
	const form = useForm<z.infer<typeof signinSchema>>({
		resolver: zodResolver(signinSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signinSchema>) => {
		try {
			const result = await signIn("credentials", {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			if (result?.error) {
				if (result.error === "CredentialsSignin") {
					toast({
						title: "Login Failed",
						description: "Incorrect username or password",
						variant: "destructive",
					});
				} else {
					toast({
						title: "Error",
						description: result.error,
						variant: "destructive",
					});
				}
			}

			if (result?.url) {
				toast({
					title: "Success",
					description: "You have successfully signed in.",
					variant: "default",
				});
				router.replace("/dashboard");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred while signing in.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border-2">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Welcome Back to True Speech
					</h1>
					<p className="mb-4">
						Sign in to continue your secret conversations
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Email address or Username
									</FormLabel>
									<Input
										placeholder="Email address or Username"
										{...field}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<Input
										type="password"
										placeholder="Password"
										{...field}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full"
							type="submit"
						>
							Sign In
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not a member yet?{" "}
						<Link
							href="/sign-up"
							className="text-blue-600 hover:text-blue-800"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
