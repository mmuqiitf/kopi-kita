CREATE TYPE "public"."contact_type" AS ENUM('email', 'phone', 'whatsapp');--> statement-breakpoint
CREATE TABLE "customer_interests" (
	"customer_id" uuid NOT NULL,
	"interest_tag_id" integer NOT NULL,
	CONSTRAINT "customer_interests_customer_id_interest_tag_id_pk" PRIMARY KEY("customer_id","interest_tag_id")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact" text,
	"contact_type" "contact_type",
	"favorite_product" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interest_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "interest_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "promo_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"theme" text NOT NULL,
	"segment_description" text NOT NULL,
	"why_now" text NOT NULL,
	"message" text NOT NULL,
	"best_time_window" text,
	"target_count" integer NOT NULL,
	"week_of" date NOT NULL,
	"created_by" uuid,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "customer_interests" ADD CONSTRAINT "customer_interests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_interests" ADD CONSTRAINT "customer_interests_interest_tag_id_interest_tags_id_fk" FOREIGN KEY ("interest_tag_id") REFERENCES "public"."interest_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_campaigns" ADD CONSTRAINT "promo_campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;