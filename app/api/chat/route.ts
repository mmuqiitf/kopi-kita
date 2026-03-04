import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { count, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { customers, customerInterests, interestTags } from "@/lib/db/schema";
import { buildChatSystemPrompt } from "@/lib/prompts/chat";

export const maxDuration = 30;

export async function POST(request: Request) {
	const db = getDb();
	const { messages }: { messages: UIMessage[] } = await request.json();
	const modelMessages = await convertToModelMessages(messages);

	const totalCustomersResult = await db
		.select({ value: count() })
		.from(customers);
	const totalCustomers = totalCustomersResult[0]?.value ?? 0;

	const topTags = await db
		.select({
			tag: interestTags.name,
			count: count(),
		})
		.from(customerInterests)
		.innerJoin(
			interestTags,
			eq(customerInterests.interestTagId, interestTags.id),
		)
		.groupBy(interestTags.name)
		.orderBy(desc(count()))
		.limit(8);

	const system = buildChatSystemPrompt({
		totalCustomers,
		topTags,
	});

	const result = streamText({
		model: groq("llama-3.3-70b-versatile"),
		system,
		messages: modelMessages,
	});

	return result.toUIMessageStreamResponse();
}
