import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "True Speech | Verification Code",
			react: VerificationEmail({username: username, otp: verifyCode}),
		});

		return {
			success: true,
			message: "Verification email send successfully",
		};
	} catch (emailError) {
		return { success: false, message: "Failed to send verification email" };
	}
}
