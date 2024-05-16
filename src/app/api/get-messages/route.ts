import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return new ApiError(401, "Not Authenticated");
	}

	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const user = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{
				$group: {
					_id: "$_id",
					messages: { $push: "$messages" },
				},
			},
		]);

		if (!user || user.length === 0) {
			return new ApiError(404, "User not found");
		}

		return new ApiResponse(200, user[0].messages);
	} catch (error) {
		console.log("An unexpected error while getting messages: ", error);
		return new ApiError(500, "Internal Server Error");
	}
}
