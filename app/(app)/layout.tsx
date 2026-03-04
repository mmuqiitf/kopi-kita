import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

const navItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/customers", label: "Customers" },
	{ href: "/promo", label: "Promo Ideas" },
	{ href: "/chat", label: "AI Chat" },
];

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
					<div>
						<p className="text-sm font-semibold">Kopi Kita CRM</p>
						<p className="text-xs text-muted-foreground">
							Hi, {session.user.name}
						</p>
					</div>

					<form
						action={async () => {
							"use server";
							await signOut({ redirectTo: "/login" });
						}}
					>
						<Button type="submit" variant="outline">
							Sign out
						</Button>
					</form>
				</div>
			</header>

			<div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
				<aside className="border border-border p-3">
					<nav className="grid gap-2">
						{navItems.map((item) => (
							<Button
								key={item.href}
								asChild
								variant="outline"
								className="justify-start"
							>
								<Link href={item.href}>{item.label}</Link>
							</Button>
						))}
					</nav>
				</aside>

				<section>{children}</section>
			</div>
		</div>
	);
}
