import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return new ApiError(401, "Not Authenticated");
	}

	const userId = user._id;

	const { acceptingMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findById(
			userId,
			{ isAcceptingMessage: acceptingMessages },
			{ new: true }
		);

		if (!updatedUser) {
			return new ApiError(
				401,
				"Failed to update user status to accept messages"
			);
		}

		return new ApiResponse(
			200,
			updatedUser,
			"User status updated to accept messages"
		);
	} catch (error) {
		console.error("Failed to update the user status to accept messages");
		return new ApiError(
			500,
			"Failed to update the user status to accept messages"
		);
	}
}

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return new ApiError(401, "Not Authenticated");
	}

	const userId = user._id;

	try {
		const foundUser = await UserModel.findById(userId);

		if (!foundUser) {
			return new ApiError(404, "User not found");
		}

		return new ApiResponse(
			200,
			{ isAcceptingMessages: foundUser.isAcceptingMessage, user },
			"User status to accept messages fetched successfully"
		);
	} catch (error) {
		console.error("Failed to fetch the user status to accept messages");
		return new ApiError(
			500,
			"Failed to fetch the user status to accept messages"
		);
	}
}
