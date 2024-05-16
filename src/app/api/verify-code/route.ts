import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(request: Request) {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	await dbConnect();

	try {
		const { username, code } = await request.json();

		const decodedUsername = decodeURIComponent(username);

		const user = await UserModel.findOne({ username: decodedUsername });

		if (!user) {
			return new ApiError(500, "User not found");
		}

		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return new ApiResponse(200, "Account verified successfully");
		} else if (!isCodeNotExpired) {
			return new ApiError(
				400,
				"Verification code has expired please sign up again to get a new code"
			);
		} else {
			return new ApiError(500, "Incorrect verification code");
		}
	} catch (error) {
		console.error("Error verifying username", error);
		return new ApiError(500, "Error verifying username");
	}
}
