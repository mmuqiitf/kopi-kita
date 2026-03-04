import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCustomerTrends, savePromoCampaign } from "@/lib/data/promo";
import { buildPromoPrompt } from "@/lib/prompts/promo";
import { generateText, Output } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const groqClient = createGroq({
	apiKey: process.env.GROQ_API_KEY,
});

const generatedPromoSchema = z.object({
	campaigns: z.array(
		z.object({
			theme: z.string(),
			segmentDescription: z.string(),
			whyNow: z.string(),
			message: z.string(),
			bestTimeWindow: z.string().nullable(),
			targetCount: z.number().int().min(1),
			weekOf: z.string(), // ISO string date
		}),
	),
});

export async function POST() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// 1. Fetch aggregate customer data
		const trends = await getCustomerTrends();

		// 2. Build the prompt
		const prompt = buildPromoPrompt(trends);

		// 3. Generate structured response with Groq
		const result = await generateText({
			model: groqClient("meta-llama/llama-4-scout-17b-16e-instruct"),
			output: Output.object({ schema: generatedPromoSchema }),
			system: "You are a professional marketing strategist.",
			prompt,
			temperature: 0.7,
		});

		const object = result.output;

		// 4. Save all generated campaigns to the database
		const savedCampaigns = [];
		for (const campaignData of object.campaigns) {
			const saved = await savePromoCampaign(campaignData, session.user.id);
			savedCampaigns.push({
				...campaignData,
				id: saved.id,
			});
		}

		return NextResponse.json({ campaigns: savedCampaigns });
	} catch (error: unknown) {
		console.error("Failed to generate promos:", error);
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Failed to generate promos", message },
			{ status: 500 },
		);
	}
}
