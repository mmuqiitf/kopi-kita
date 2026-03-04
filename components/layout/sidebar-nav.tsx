"use client";

import { Home, User, Sparkles, MessageSquare, LucideIcon } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";

export interface NavItemConfig {
	href: string;
	label: string;
	icon: LucideIcon;
}

const navItems: Array<NavItemConfig> = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: Home,
	},
	{
		href: "/customers",
		label: "Customers",
		icon: User,
	},
	{
		href: "/promo",
		label: "Promo Ideas",
		icon: Sparkles,
	},
	{
		href: "/chat",
		label: "AI Chat",
		icon: MessageSquare,
	},
];

export function SidebarNav({ mobile }: { mobile?: boolean }) {
	return (
		<nav className={mobile ? "grid gap-2 text-lg font-medium" : "grid gap-0"}>
			{navItems.map((item) => (
				<NavLink
					key={item.href}
					href={item.href}
					label={item.label}
					icon={item.icon}
					mobile={mobile}
				/>
			))}
		</nav>
	);
}
