import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
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
			return Response.json(
				{
					success: false,
					message:
						"Unable to find user to update message acceptance status",
				},
				{ status: 404 }
			);
		}
		return Response.json(
			{
				success: true,
				message: "User status updated to accept messages",
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to update the user status to accept messages");
		return Response.json(
			{
				success: false,
				message: "Failed to update the user status to accept messages",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
	}

	const userId = user._id;

	try {
		const foundUser = await UserModel.findById(userId);

		if (!foundUser) {
			return Response.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "User status to accept messages fetched successfully",
				isAcceptingMessages: foundUser.isAcceptingMessage,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error retrieving message acceptance status");
		return Response.json(
			{
				success: false,
				message: "Error retrieving message acceptance status",
			},
			{ status: 500 }
		);
	}
}
