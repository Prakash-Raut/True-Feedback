import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "True Speech",
	description: "Send and receive messages anonymously.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<AuthProvider>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</AuthProvider>
		</html>
	);
}
