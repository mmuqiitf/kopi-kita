import "dotenv/config";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import {
	customers,
	customerInterests,
	interestTags,
	users,
} from "@/lib/db/schema";

const seedTags = [
	"sweet drinks",
	"oat milk",
	"caramel",
	"pastry lover",
	"workshop",
	"black coffee",
	"iced drinks",
	"matcha",
	"latte art",
	"weekend hangout",
	"morning rush",
];

const seedCustomers = [
	{
		name: "Alya Pratama",
		favoriteProduct: "Caramel Cold Brew",
		contact: "alya@example.com",
		contactType: "email",
		tags: ["sweet drinks", "caramel", "iced drinks"],
	},
	{
		name: "Bima Nugroho",
		favoriteProduct: "Oat Milk Latte",
		contact: "081234567801",
		contactType: "whatsapp",
		tags: ["oat milk", "latte art"],
	},
	{
		name: "Citra Lestari",
		favoriteProduct: "Butter Croissant",
		contact: "citra@example.com",
		contactType: "email",
		tags: ["pastry lover", "sweet drinks"],
	},
	{
		name: "Danu Saputra",
		favoriteProduct: "Americano",
		contact: "081234567802",
		contactType: "phone",
		tags: ["black coffee", "weekend hangout"],
	},
	{
		name: "Eka Wulandari",
		favoriteProduct: "Matcha Latte",
		contact: "eka@example.com",
		contactType: "email",
		tags: ["matcha", "sweet drinks"],
	},
	{
		name: "Fajar Akbar",
		favoriteProduct: "Caramel Latte",
		contact: "081234567803",
		contactType: "whatsapp",
		tags: ["caramel", "oat milk"],
	},
	{
		name: "Gita Maharani",
		favoriteProduct: "Pain au Chocolat",
		contact: "gita@example.com",
		contactType: "email",
		tags: ["pastry lover", "weekend hangout"],
	},
	{
		name: "Hendra Kusuma",
		favoriteProduct: "Cold Brew",
		contact: "081234567804",
		contactType: "phone",
		tags: ["iced drinks", "black coffee"],
	},
	{
		name: "Intan Safira",
		favoriteProduct: "Hazelnut Latte",
		contact: "intan@example.com",
		contactType: "email",
		tags: ["sweet drinks", "latte art"],
	},
	{
		name: "Joko Wirawan",
		favoriteProduct: "Espresso",
		contact: "081234567805",
		contactType: "phone",
		tags: ["black coffee", "workshop"],
	},
	{
		name: "Kirana Putri",
		favoriteProduct: "Vanilla Oat Latte",
		contact: "081234567806",
		contactType: "whatsapp",
		tags: ["oat milk", "sweet drinks"],
	},
	{
		name: "Lukman Hakim",
		favoriteProduct: "Cheese Danish",
		contact: "lukman@example.com",
		contactType: "email",
		tags: ["pastry lover", "morning rush"],
	},
];

async function seed() {
	const db = getDb();
	const passwordHash = await bcrypt.hash("kopikita123", 10);

	await db
		.insert(users)
		.values({
			name: "Mimi",
			email: "mimi@kopikita.com",
			passwordHash,
		})
		.onConflictDoNothing({ target: users.email });

	const [mimi] = await db
		.select()
		.from(users)
		.where(eq(users.email, "mimi@kopikita.com"))
		.limit(1);

	if (!mimi) {
		throw new Error("Seed user not found");
	}

	for (const tag of seedTags) {
		await db
			.insert(interestTags)
			.values({ name: tag })
			.onConflictDoNothing({ target: interestTags.name });
	}

	const allTags = await db.select().from(interestTags);
	const tagsByName = new Map(allTags.map((tag) => [tag.name, tag.id]));

	for (const item of seedCustomers) {
		const [customer] = await db
			.insert(customers)
			.values({
				name: item.name,
				favoriteProduct: item.favoriteProduct,
				contact: item.contact,
				contactType: item.contactType as "email" | "phone" | "whatsapp",
				createdBy: mimi.id,
			})
			.returning();

		for (const tagName of item.tags) {
			const tagId = tagsByName.get(tagName);
			if (!tagId) continue;

			await db
				.insert(customerInterests)
				.values({ customerId: customer.id, interestTagId: tagId })
				.onConflictDoNothing();
		}
	}

	console.log("Seed complete: mimi@kopikita.com / kopikita123");
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
