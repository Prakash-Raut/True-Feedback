"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
	const { data: session } = useSession();
	const user: User = session?.user as User;

	return (
		<nav className="p-4 md:p-6 border-b">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<Link
					href="/"
					className="text-xl font-bold mb-4 md:mb-0"
				>
					True Speech
				</Link>
				<div className="flex justify-center items-center gap-10">
					<ModeToggle />
					{session ? (
						<>
							<span className="mr-4">
								Welcome, {user?.username || user?.email}
							</span>
							<Button
								onClick={() => signOut()}
								className="w-full md:w-auto font-bold"
								variant="outline"
							>
								Logout
							</Button>
						</>
					) : (
						<Link href="/sign-in">
							<Button
								className="w-full md:w-auto font-bold"
								variant="outline"
							>
								Login
							</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
