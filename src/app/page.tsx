"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Main content */}
			<main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 bg-white text-slate-800">
				<section className="text-center mb-8 md:mb-12">
					<div className="relative isolate px-6 lg:px-8">
						<div
							className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
							aria-hidden="true"
						>
							<div
								className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
								style={{
									clipPath:
										"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
								}}
							/>
						</div>
						<div className="mx-auto max-w-2xl">
							<div className="text-center">
								<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
								Dive into the World of True Speech
								</h1>
								<p className="leading-7 [&:not(:first-child)]:mt-6">
									True Speech - Where your identity remains
									a secret.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Carousel for Messages */}
				<Carousel
					plugins={[Autoplay({ delay: 2000 })]}
					className="w-full max-w-lg md:max-w-xl"
				>
					<CarouselContent>
						{messages.map((message, index) => (
							<CarouselItem
								key={index}
								className="p-4"
							>
								<Card>
									<CardHeader>
										<CardTitle>{message.title}</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
										<Mail className="flex-shrink-0" />
										<div>
											<p>{message.content}</p>
											<p className="text-xs text-muted-foreground">
												{message.received}
											</p>
										</div>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</main>

			{/* Footer */}
			<footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
				© 2024 True Speech. All rights reserved.
			</footer>
		</div>
	);
}
