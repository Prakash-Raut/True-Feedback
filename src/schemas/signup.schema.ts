import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, { message: "Username must be atleast 2 characters" })
	.max(20, { message: "Username must be not more than 20 characters" })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: "Username must not contain special characters",
	});

export const emailValidation = z
	.string()
	.email({ message: "Invalid email address" });

export const passwordValidation = z
	.string()
	.min(6, { message: "Username must be atleast 2 characters" })
	.max(20, { message: "Username must be not more than 20 characters" });

export const signupSchema = z.object({
	username: usernameValidation,
	email: emailValidation,
	password: passwordValidation,
});
