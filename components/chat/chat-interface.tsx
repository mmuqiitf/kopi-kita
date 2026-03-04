"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, User, Bot, Loader2, Sparkles, Coffee } from "lucide-react";
import { useRef, useEffect, useState, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const SUGGESTED_PROMPTS = [
	"What's our most popular product?",
	"Recommend a weekend promo theme.",
	"How many customers do we have?",
	"Analyze current interest tags.",
];

export function ChatInterface() {
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: "/api/chat" }),
	});

	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isLoading = status === "submitted" || status === "streaming";

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		sendMessage({ text: trimmed });
		setInput("");
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
	};

	return (
		<Card className="h-[calc(100vh-180px)] w-full">
			<CardHeader className="border-b flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center">
						<Coffee className="h-4 w-4 text-amber-600" />
					</div>
					<div className="space-y-0.5">
						<CardTitle className="text-xl font-bold">
							Kopi Kita AI Assistant
						</CardTitle>
						<CardDescription className="flex items-center gap-2">
							<Badge variant="outline" className="h-5 px-2 py-0 text-[10px]">
								Online
							</Badge>
							Powered by store data
						</CardDescription>
					</div>
				</div>
				<Sparkles className="h-4 w-4 text-muted-foreground" />
			</CardHeader>

			<CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
				{messages.length === 0 && (
					<div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
						<div className="p-4 bg-muted rounded-full">
							<Sparkles className="h-8 w-8 text-amber-500" />
						</div>
						<div>
							<h4 className="font-semibold text-xl">
								How can I help you today?
							</h4>
							<p className="text-sm text-muted-foreground max-w-xs mt-2">
								I can answer questions about customer trends, suggest promo
								ideas, or analyze your current products.
							</p>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-left w-full max-w-md">
							{SUGGESTED_PROMPTS.map((suggestion) => (
								<Button
									key={suggestion}
									type="button"
									variant="secondary"
									size="sm"
									onClick={() => handleSuggestionClick(suggestion)}
									className="h-auto py-2.5 px-3 whitespace-normal justify-start text-left"
								>
									{suggestion}
								</Button>
							))}
						</div>
					</div>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex items-start gap-3 ${
							message.role === "user" ? "flex-row-reverse" : "flex-row"
						}`}
					>
						{/* Avatar */}
						<div
							className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${
								message.role === "user"
									? "bg-primary text-primary-foreground border-primary"
									: "bg-muted border-border text-muted-foreground"
							}`}
						>
							{message.role === "user" ? (
								<User className="h-4 w-4" />
							) : (
								<Bot className="h-4 w-4" />
							)}
						</div>

						{/* Bubble */}
						<div
							className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
								message.role === "user"
									? "bg-primary text-primary-foreground rounded-tr-none"
									: "bg-muted text-foreground rounded-tl-none border"
							}`}
						>
							{message.parts.map((part, i) =>
								part.type === "text" ? (
									<span key={i} className="whitespace-pre-wrap">
										{part.text}
									</span>
								) : null,
							)}
						</div>
					</div>
				))}

				{/* AI typing indicator */}
				{isLoading && (
					<div className="flex items-start gap-3">
						<div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border bg-muted border-border text-muted-foreground">
							<Bot className="h-4 w-4" />
						</div>
						<div className="bg-muted border rounded-2xl rounded-tl-none px-4 py-3">
							<Loader2 className="h-4 w-4 animate-spin text-amber-500" />
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</CardContent>

			<CardFooter className="bg-muted/20">
				<form onSubmit={handleSubmit} className="w-full">
					<div className="relative flex items-center w-full">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask Kopi Kita AI anything..."
							disabled={isLoading}
							className="pr-12"
						/>
						<Button
							type="submit"
							size="icon"
							disabled={isLoading || !input.trim()}
							className="absolute right-1 h-8 w-8"
						>
							{isLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Send className="h-4 w-4" />
							)}
						</Button>
					</div>
					<p className="text-[10px] text-center text-muted-foreground mt-2">
						AI may provide inaccurate info. Always verify customer-specific data
						manually.
					</p>
				</form>
			</CardFooter>
		</Card>
	);
}
