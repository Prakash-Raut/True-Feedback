import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

interface Params {
	messageid: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
	const messageId = params.messageid;

	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !user) {
		return Response.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
	}

	try {
		const updateResult = await UserModel.updateOne(
			{ _id: user._id },
			{ $pull: { messages: { _id: messageId } } }
		);

		if (updateResult.modifiedCount === 0) {
			return Response.json(
				{
					message: "Message not found or already deleted",
					success: false,
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{ message: "Message deleted", success: true },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ message: "Error deleting message", success: false },
			{ status: 500 }
		);
	}
}
