import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(request: Request) {
	await dbConnect();

	const { username, content } = await request.json();

	try {
		const user = await UserModel.findOne(username);

		if (!user) {
			return new ApiError(404, "User not found");
		}

		if (!user.isAcceptingMessage) {
			return new ApiError(403, "User is not accepting messages");
		}

		const newMessage = { content, createdAt: new Date() };

		user.messages.push(newMessage as Message);

		await user.save();

		return new ApiResponse(200, "Message sent successfully");
	} catch (error) {
		console.log("An unexpected error while sending messages: ", error);

		return new ApiError(500, "Internal Server Error");
	}
}
