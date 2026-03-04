import {
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const contactTypeEnum = pgEnum("contact_type", [
	"email",
	"phone",
	"whatsapp",
]);

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const customers = pgTable("customers", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	contact: text("contact"),
	contactType: contactTypeEnum("contact_type"),
	favoriteProduct: text("favorite_product").notNull(),
	createdBy: uuid("created_by").references(() => users.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const interestTags = pgTable("interest_tags", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().unique(),
});

export const customerInterests = pgTable(
	"customer_interests",
	{
		customerId: uuid("customer_id")
			.notNull()
			.references(() => customers.id, { onDelete: "cascade" }),
		interestTagId: integer("interest_tag_id")
			.notNull()
			.references(() => interestTags.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({
			columns: [table.customerId, table.interestTagId],
		}),
	],
);

export const promoCampaigns = pgTable("promo_campaigns", {
	id: uuid("id").defaultRandom().primaryKey(),
	theme: text("theme").notNull(),
	segmentDescription: text("segment_description").notNull(),
	whyNow: text("why_now").notNull(),
	message: text("message").notNull(),
	bestTimeWindow: text("best_time_window"),
	targetCount: integer("target_count").notNull(),
	weekOf: date("week_of").notNull(),
	createdBy: uuid("created_by").references(() => users.id, {
		onDelete: "set null",
	}),
	generatedAt: timestamp("generated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
