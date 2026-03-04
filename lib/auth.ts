import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

const credentialsSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
	},
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				const db = getDb();
				const parsedCredentials = credentialsSchema.safeParse(credentials);

				if (!parsedCredentials.success) {
					return null;
				}

				const [existingUser] = await db
					.select()
					.from(users)
					.where(eq(users.email, parsedCredentials.data.email))
					.limit(1);

				if (!existingUser) {
					return null;
				}

				const isValidPassword = await bcrypt.compare(
					parsedCredentials.data.password,
					existingUser.passwordHash,
				);

				if (!isValidPassword) {
					return null;
				}

				return {
					id: existingUser.id,
					email: existingUser.email,
					name: existingUser.name,
				};
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
});
