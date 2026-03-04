import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import { Menu, Coffee } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { SidebarNav } from "@/components/layout/sidebar-nav";

import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";

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
							<SheetContent side="left" className="w-75 sm:w-100">
								<div className="sr-only">
									<SheetTitle>Navigation Menu</SheetTitle>
									<SheetDescription>
										Access different sections of the Kopi Kita CRM.
									</SheetDescription>
								</div>
								<div className="flex flex-col gap-6 mt-8">
									<div className="px-3">
										<div className="flex items-center gap-2 font-bold text-xl text-amber-900 border-b pb-4 mb-4">
											<Coffee className="h-6 w-6 text-amber-600" />
											Kopi Kita CRM
										</div>
									</div>
									<SidebarNav mobile />
								</div>
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
						<LogoutButton />
					</div>
				</div>
			</header>

			<div className="flex flex-1 w-full max-w-7xl mx-auto md:grid md:grid-cols-[240px_1fr]">
				{/* Sidebar */}
				<aside className="hidden md:flex flex-col border-r border-border py-4 pr-0">
					<SidebarNav />
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 w-full p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
