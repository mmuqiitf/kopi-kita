import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
	const session = await auth();

	if (session?.user) {
		redirect("/dashboard");
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<LoginForm />
		</main>
	);
}
