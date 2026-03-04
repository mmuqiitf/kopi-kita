import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { customers, customerInterests, interestTags } from "@/lib/db/schema";
import { buildPromoPrompt } from "@/lib/prompts/promo";

const campaignSchema = z.object({
	theme: z.string(),
	segmentDescription: z.string(),
	whyNow: z.string(),
	message: z.string(),
	bestTimeWindow: z.string().optional(),
	targetCount: z.number().int().nonnegative(),
});

const responseSchema = z.object({
	campaigns: z.array(campaignSchema).min(2).max(3),
});

export async function POST() {
	const db = getDb();
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
		.limit(10);

	const topProducts = await db
		.select({
			product: customers.favoriteProduct,
			count: count(),
		})
		.from(customers)
		.groupBy(customers.favoriteProduct)
		.orderBy(desc(count()))
		.limit(10);

	const prompt = buildPromoPrompt({
		totalCustomers,
		topTags,
		topProducts,
	});

	const result = await generateObject({
		model: groq("llama-3.3-70b-versatile"),
		schema: responseSchema,
		prompt,
	});

	return NextResponse.json(result.object);
}
