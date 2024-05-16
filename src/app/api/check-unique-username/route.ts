import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signup.schema";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { z } from "zod";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	if (request.method !== "GET") {
		return new Response("Method not allowed", { status: 405 });
	}

	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const queryParam = {
			username: searchParams.get("username"),
		};
		// validate with zod
		const result = UsernameQuerySchema.safeParse(queryParam);
		console.log("Unique username check :: Username Query Schema ", result);
		if (!result.success) {
			const usernameErrors =
				result.error.format().username?._errors || [];
			return new ApiError(
				400,
				usernameErrors?.length > 0
					? usernameErrors.join(", ")
					: "Invliad query parameters"
			);
		}

		const { username } = result.data;

		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) {
			return new ApiError(400, "Username already taken");
		}

		return new ApiResponse(200, {
			success: true,
			message: "Username available",
		});
	} catch (error) {
		console.error("Error checking unique username", error);
		return new ApiError(500, "Error checking username");
	}
}
