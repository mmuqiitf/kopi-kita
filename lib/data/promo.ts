import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
	customers,
	interestTags,
	customerInterests,
	promoCampaigns,
} from "@/lib/db/schema";
import { z } from "zod";

export const promoCampaignSchema = z.object({
	theme: z.string().min(5),
	segmentDescription: z.string().min(5),
	whyNow: z.string().min(5),
	message: z.string().min(5),
	bestTimeWindow: z.string().nullable().optional(),
	targetCount: z.number().int().min(1),
	weekOf: z.string(), // ISO date string portion using YYYY-MM-DD
});

export type PromoCampaignInput = z.infer<typeof promoCampaignSchema>;

export async function getCustomerTrends() {
	const db = getDb();

	// Total customers
	const totalCustomersRes = await db.select({ count: count() }).from(customers);
	const totalCustomers = totalCustomersRes[0]?.count || 0;

	// Popular favorite products (top 5)
	const productsRes = await db
		.select({
			product: customers.favoriteProduct,
			count: count(),
		})
		.from(customers)
		.groupBy(customers.favoriteProduct)
		.orderBy(desc(count()))
		.limit(5);

	// Popular tags (top 5)
	const tagsRes = await db
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
		.limit(5);

	return {
		totalCustomers,
		topProducts: productsRes,
		topTags: tagsRes,
	};
}

export async function savePromoCampaign(
	input: PromoCampaignInput,
	userId?: string,
) {
	const db = getDb();

	const [created] = await db
		.insert(promoCampaigns)
		.values({
			theme: input.theme,
			segmentDescription: input.segmentDescription,
			whyNow: input.whyNow,
			message: input.message,
			bestTimeWindow: input.bestTimeWindow,
			targetCount: input.targetCount,
			weekOf: input.weekOf,
			createdBy: userId ?? null,
		})
		.returning({ id: promoCampaigns.id });

	return created;
}

export async function listRecentPromos() {
	const db = getDb();

	return db
		.select()
		.from(promoCampaigns)
		.orderBy(desc(promoCampaigns.generatedAt))
		.limit(10);
}
