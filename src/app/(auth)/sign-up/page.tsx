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
import { signupSchema } from "@/schemas/signup.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

export default function SignUp() {
	const [username, setUsername] = useState<string>("");
	const [usernameMessage, setUsernameMessage] = useState<string>("");
	const [isCheckingUsername, setIsCheckingUsername] =
		useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const debounced = useDebounceCallback(setUsername, 500);
	const { toast } = useToast();
	const router = useRouter();

	// zod implementation
	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUniqueUsername = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("Checking username...");
				try {
					const response = await axios.get(
						`/api/check-unique-username?username=${username}`
					);
					let message = response.data.message;
					setUsernameMessage(message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ||
							"Error checking username!"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUniqueUsername();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signupSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>(
				"/api/sign-up",
				data
			);
			toast({
				title: "Success!",
				description: response?.data.message,
			});
			router.replace(`/verify/${username}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage =
				axiosError.response?.data.message || "Error in sign-up";
			toast({
				title: "Sign-up Failed!",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border-2">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Speech
					</h1>
					<p className="mb-4">
						Sign up to start your anonymous adventure
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<Input
										{...field}
										placeholder="Username"
										onChange={(e) => {
											field.onChange(e);
											debounced(e.target.value);
										}}
									/>
									{isCheckingUsername && (
										<Loader2 className="animate-spin" />
									)}
									{!isCheckingUsername && usernameMessage && (
										<p
											className={`text-sm ${
												usernameMessage ===
												"Username is unique"
												? "text-red-500"
													: "text-green-500"
											}`}
										>
											{usernameMessage}
										</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Input
										{...field}
										name="email"
										type="email"
										placeholder="Email"
									/>
									<p className="text-muted text-sm">
										We will send you a verification code
									</p>
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
										{...field}
										name="password"
										placeholder="Password"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link
							href="/sign-in"
							className="text-blue-600 hover:text-blue-800"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
