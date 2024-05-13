import { z } from "zod";

export const verifyCodeValidation = z
    .string()
    .length(6, {message: "Verification code must be atleast 6 digits"})

export const verifySchema = z.object({
    verifyCode: verifyCodeValidation
})