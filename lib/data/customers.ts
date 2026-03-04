import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/lib/db";
import {
	contactTypeEnum,
	customers,
	customerInterests,
	interestTags,
} from "@/lib/db/schema";

const contactTypeValues = contactTypeEnum.enumValues;

export const customerInputSchema = z.object({
	name: z.string().min(2).max(80),
	contact: z.string().max(120).optional().nullable(),
	contactType: z.enum(contactTypeValues).optional().nullable(),
	favoriteProduct: z.string().min(2).max(120),
	tags: z.array(z.string().min(1).max(40)).max(20),
});

export const customerUpdateSchema = customerInputSchema.extend({
	id: z.uuid(),
});

export const customerDeleteSchema = z.object({
	id: z.uuid(),
});

export type CustomerInput = z.infer<typeof customerInputSchema>;

function normalizeTags(rawTags: string[]) {
	return Array.from(
		new Set(
			rawTags
				.map((tag) => tag.trim().toLowerCase())
				.filter((tag) => tag.length > 0),
		),
	);
}

export async function listInterestTags() {
	const db = getDb();

	return db
		.select({
			id: interestTags.id,
			name: interestTags.name,
		})
		.from(interestTags)
		.orderBy(asc(interestTags.name));
}

export async function listCustomers(filters: {
	search?: string;
	tag?: string;
}) {
	const db = getDb();

	const search = filters.search?.trim();
	const tag = filters.tag?.trim().toLowerCase();

	const whereClauses = [];

	if (search) {
		whereClauses.push(
			or(
				ilike(customers.name, `%${search}%`),
				ilike(customers.favoriteProduct, `%${search}%`),
			),
		);
	}

	if (tag) {
		const matchingIds = await db
			.selectDistinct({ customerId: customerInterests.customerId })
			.from(customerInterests)
			.innerJoin(
				interestTags,
				eq(customerInterests.interestTagId, interestTags.id),
			)
			.where(eq(sql`lower(${interestTags.name})`, tag));

		if (matchingIds.length === 0) {
			return [];
		}

		whereClauses.push(
			inArray(
				customers.id,
				matchingIds.map((item) => item.customerId),
			),
		);
	}

	const baseRows = await db
		.select({
			id: customers.id,
			name: customers.name,
			contact: customers.contact,
			contactType: customers.contactType,
			favoriteProduct: customers.favoriteProduct,
			createdAt: customers.createdAt,
		})
		.from(customers)
		.where(whereClauses.length ? and(...whereClauses) : undefined)
		.orderBy(desc(customers.createdAt));

	if (baseRows.length === 0) {
		return [];
	}

	const customerIds = baseRows.map((item) => item.id);

	const tagRows = await db
		.select({
			customerId: customerInterests.customerId,
			tag: interestTags.name,
		})
		.from(customerInterests)
		.innerJoin(
			interestTags,
			eq(customerInterests.interestTagId, interestTags.id),
		)
		.where(inArray(customerInterests.customerId, customerIds));

	const tagsByCustomer = new Map<string, string[]>();

	for (const row of tagRows) {
		const existing = tagsByCustomer.get(row.customerId) ?? [];
		tagsByCustomer.set(row.customerId, [...existing, row.tag]);
	}

	return baseRows.map((row) => ({
		...row,
		tags: tagsByCustomer.get(row.id) ?? [],
	}));
}

async function syncCustomerTags(customerId: string, tags: string[]) {
	const db = getDb();
	const normalizedTags = normalizeTags(tags);

	await db
		.delete(customerInterests)
		.where(eq(customerInterests.customerId, customerId));

	if (normalizedTags.length === 0) {
		return;
	}

	await db
		.insert(interestTags)
		.values(normalizedTags.map((name) => ({ name })))
		.onConflictDoNothing({ target: interestTags.name });

	const tagRows = await db
		.select({ id: interestTags.id })
		.from(interestTags)
		.where(inArray(interestTags.name, normalizedTags));

	if (tagRows.length === 0) {
		return;
	}

	await db
		.insert(customerInterests)
		.values(
			tagRows.map((tagRow) => ({
				customerId,
				interestTagId: tagRow.id,
			})),
		)
		.onConflictDoNothing();
}

export async function createCustomer(input: CustomerInput, userId?: string) {
	const db = getDb();

	const [created] = await db
		.insert(customers)
		.values({
			name: input.name,
			contact: input.contact ?? null,
			contactType: input.contactType ?? null,
			favoriteProduct: input.favoriteProduct,
			createdBy: userId ?? null,
		})
		.returning({ id: customers.id });

	await syncCustomerTags(created.id, input.tags);
	return created;
}

export async function updateCustomer(
	input: z.infer<typeof customerUpdateSchema>,
) {
	const db = getDb();

	await db
		.update(customers)
		.set({
			name: input.name,
			contact: input.contact ?? null,
			contactType: input.contactType ?? null,
			favoriteProduct: input.favoriteProduct,
		})
		.where(eq(customers.id, input.id));

	await syncCustomerTags(input.id, input.tags);
}

export async function deleteCustomer(
	input: z.infer<typeof customerDeleteSchema>,
) {
	const db = getDb();

	await db.delete(customers).where(eq(customers.id, input.id));
}
