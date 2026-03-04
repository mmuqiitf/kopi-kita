"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, User, Bot, Loader2, Sparkles, Coffee } from "lucide-react";
import { useRef, useEffect, useState, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
		<div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto border rounded-xl overflow-hidden bg-background shadow-lg">
			{/* Chat Header */}
			<div className="bg-muted/30 border-b p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/30">
						<Coffee className="h-5 w-5 text-amber-600" />
					</div>
					<div>
						<h3 className="font-semibold leading-none">
							Kopi Kita AI Assistant
						</h3>
						<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
							<Badge
								variant="outline"
								className="h-4 px-1 py-0 text-[10px] font-normal border-green-500/50 text-green-600 bg-green-500/5"
							>
								Online
							</Badge>
							Powered by store data
						</p>
					</div>
				</div>
				<Sparkles className="h-5 w-5 text-amber-400 opacity-50" />
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 && (
					<div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
						<div className="p-4 bg-amber-50 rounded-full dark:bg-amber-950/20">
							<Sparkles className="h-8 w-8 text-amber-500" />
						</div>
						<div>
							<h4 className="font-semibold text-lg">
								How can I help you today?
							</h4>
							<p className="text-sm text-muted-foreground max-w-xs mt-2">
								I can answer questions about customer trends, suggest promo
								ideas, or analyze your current products.
							</p>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-left w-full max-w-md">
							{SUGGESTED_PROMPTS.map((suggestion) => (
								<button
									key={suggestion}
									onClick={() => handleSuggestionClick(suggestion)}
									className="text-xs p-3 rounded-lg border bg-muted/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:border-amber-200 transition-all text-left"
								>
									{suggestion}
								</button>
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
									? "bg-amber-500 border-amber-600 text-white"
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
									? "bg-amber-500 text-white rounded-tr-none"
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
			</div>

			{/* Input Area */}
			<form onSubmit={handleSubmit} className="p-4 border-t bg-muted/20">
				<div className="relative flex items-center max-w-3xl mx-auto group">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask Kopi Kita AI anything..."
						disabled={isLoading}
						className="pr-12 py-6 rounded-xl border-input/50 focus-visible:ring-amber-500/30 group-hover:border-amber-400/50 transition-colors disabled:opacity-60"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isLoading || !input.trim()}
						className="absolute right-1.5 h-9 w-9 rounded-lg transition-all bg-amber-500 hover:bg-amber-600 shadow-md disabled:opacity-50"
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
		</div>
	);
}
