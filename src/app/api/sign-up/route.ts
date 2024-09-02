import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
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
			return Response.json(
				{
					success: false,
					message: "Username is already taken",
				},
				{ status: 400 }
			);
		}

		const existingUserByEmail = await UserModel.findOne({ email });

		let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "User already exists with this email",
					},
					{ status: 400 }
				);
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
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{
				success: true,
				message:
					"User registered successfully. Please verify your account.",
			},
			{ status: 201 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{ status: 500 }
		);
	}
}
