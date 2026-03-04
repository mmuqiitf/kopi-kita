"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Sparkles, MessageSquare, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, LucideIcon> = {
	Home,
	Users,
	Sparkles,
	MessageSquare,
};

interface NavLinkProps {
	href: string;
	label: string;
	iconName: string;
	mobile?: boolean;
}

export function NavLink({ href, label, iconName, mobile }: NavLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href;
	const Icon = ICON_MAP[iconName] || Home;

	if (mobile) {
		return (
			<Link
				href={href}
				className={cn(
					"flex items-center gap-4 rounded-xl px-3 py-3 text-base font-medium transition-all",
					isActive
						? "bg-amber-100 text-amber-900 border border-amber-200"
						: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
				)}
			>
				<Icon className={cn("h-5 w-5", isActive ? "text-amber-700" : "")} />
				{label}
			</Link>
		);
	}

	return (
		<Button
			asChild
			variant={isActive ? "secondary" : "ghost"}
			className={cn(
				"justify-start gap-3 h-11 px-4 font-medium transition-all w-full",
				isActive
					? "bg-amber-50 text-amber-900 border-r-2 border-r-amber-500 rounded-none shadow-sm"
					: "text-muted-foreground hover:text-foreground",
			)}
		>
			<Link href={href}>
				<Icon
					className={cn("h-4 w-4", isActive ? "text-amber-600 font-bold" : "")}
				/>
				{label}
			</Link>
		</Button>
	);
}
