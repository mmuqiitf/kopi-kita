import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

import {
	Home,
	Users,
	Sparkles,
	MessageSquare,
	Coffee,
	LogOut,
	Menu,
} from "lucide-react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: Home },
	{ href: "/customers", label: "Customers", icon: Users },
	{ href: "/promo", label: "Promo Ideas", icon: Sparkles },
	{ href: "/chat", label: "AI Chat", icon: MessageSquare },
];

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background px-4 md:px-6">
				<div className="flex w-full max-w-7xl items-center justify-between mx-auto gap-4">
					<div className="flex items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden shrink-0"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle navigation menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-[300px] sm:w-[400px]">
								<nav className="grid gap-2 text-lg font-medium mt-6">
									{navItems.map((item) => {
										const Icon = item.icon;
										return (
											<Link
												key={item.href}
												href={item.href}
												className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
											>
												<Icon className="h-5 w-5" />
												{item.label}
											</Link>
										);
									})}
								</nav>
							</SheetContent>
						</Sheet>
						<div className="flex items-center gap-2 font-semibold">
							<Coffee className="h-5 w-5" />
							<span className="hidden sm:inline">Kopi Kita CRM</span>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="hidden md:flex flex-col items-end mr-4">
							<p className="text-sm font-medium leading-none">
								{session.user.name}
							</p>
							<p className="text-xs text-muted-foreground mt-1">Barista Role</p>
						</div>
						<form
							action={async () => {
								"use server";
								await signOut({ redirectTo: "/login" });
							}}
						>
							<Button
								type="submit"
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground"
							>
								<LogOut className="h-5 w-5" />
							</Button>
						</form>
					</div>
				</div>
			</header>

			<div className="flex flex-1 w-full max-w-7xl mx-auto md:grid md:grid-cols-[240px_1fr]">
				{/* Sidebar */}
				<aside className="hidden md:flex flex-col border-r border-border py-6 pr-6">
					<nav className="grid gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									key={item.href}
									asChild
									variant="ghost"
									className="justify-start gap-3 h-10 px-4 font-medium"
								>
									<Link href={item.href}>
										<Icon className="h-4 w-4" />
										{item.label}
									</Link>
								</Button>
							);
						})}
					</nav>
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 w-full p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
