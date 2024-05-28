"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verify.schema";
import { ApiResponse } from "@/utils/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import * as z from "zod";

export default function VerifyAccount() {
	const router = useRouter();
	const param = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const response = await axios.post(`/api/verify-code`, {
				username: param.username,
				verifyCode: data.verifyCode,
			});

			toast({
				title: "Success",
				description: response.data.message,
			});

			router.replace("/sign-in");
		} catch (error) {
			console.error("Error in sign-up", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage =
				axiosError.response?.data.message || "Error in sign-up";
			toast({
				title: "Sign-up Failed!",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify Your Account
					</h1>
					<p className="mb-4">
						Enter the verification code sent to your email
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 space-y-6"
					>
						<FormField
							control={form.control}
							name="verifyCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<InputOTP
											maxLength={6}
											{...field}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Verify</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
