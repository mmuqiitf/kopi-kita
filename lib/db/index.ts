import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "@/lib/db/schema";

let database: PostgresJsDatabase<typeof schema> | null = null;

export function getDb() {
	if (database) {
		return database;
	}

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("Missing DATABASE_URL environment variable");
	}

	const client = postgres(connectionString, {
		prepare: false,
	});

	database = drizzle(client, { schema });
	return database;
}
