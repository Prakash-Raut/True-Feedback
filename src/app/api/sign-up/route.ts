import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	await dbConnect();

	try {
		const { username, email, password } = await req.json();

		const alreadyExistingUserVerifiedByUsername = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (alreadyExistingUserVerifiedByUsername) {
			return new ApiError(400, "Username is already taken");
		}

		const existingUserByEmail = await UserModel.findOne({ email });

		let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return new ApiError(400, "User already exists with this email");
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(
					Date.now() + 3600000
				);
				await existingUserByEmail.save();
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessages: true,
				messages: [],
			});

			await newUser.save();
		}

		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);

		if (!emailResponse.success) {
			return new ApiError(500, emailResponse.message);
		}

		return new ApiResponse(
			200,
			{
				success: true,
				message:
					"User registered successfully. Please verify your email",
			},
			"User registered successfully. Please verify your email"
		);
	} catch (error) {
		console.error("Error registering user", error);
		return new ApiError(500, "Error registering user");
	}
}
