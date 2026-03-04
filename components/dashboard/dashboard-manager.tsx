"use client";

import {
	Users,
	Sparkles,
	TrendingUp,
	Copy,
	Calendar,
	Coffee,
	Tag,
} from "lucide-react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDashboardQuery } from "./use-dashboard";

export function DashboardManager() {
	const { data, isLoading, error } = useDashboardQuery();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Message copied to clipboard!");
	};

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-100">
				<p className="text-destructive">
					Error loading dashboard: {(error as Error).message}
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6">
			{/* Dashboard Title */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Dashboard Overview
				</h1>
				<p className="text-muted-foreground">
					Strategic insights for your artisanal coffee business.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="hover:border-amber-500/50 transition-colors">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Customers
						</CardTitle>
						<Users className="h-4 w-4 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.totalCustomers.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Growth tracked automatically
						</p>
					</CardContent>
				</Card>

				<Card className="hover:border-amber-500/50 transition-colors">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Promos</CardTitle>
						<Sparkles className="h-4 w-4 text-amber-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.recentPromos.length || 0}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							AI-generated campaigns
						</p>
					</CardContent>
				</Card>

				<Card className="hover:border-amber-500/50 transition-colors md:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Interest</CardTitle>
						<TrendingUp className="h-4 w-4 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.topTags[0]?.tag || "None"}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{data?.topTags[0]?.count || 0} customers interested
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				{/* Popular Trends */}
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle>Popular Trends</CardTitle>
						<CardDescription>
							Aggregate data from your customers.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
							<div className="space-y-4">
								<h4 className="text-sm font-medium flex items-center gap-2">
									<Coffee className="h-4 w-4 text-amber-600" /> Top Products
								</h4>
								<div className="space-y-3">
									{data?.topProducts.map((p, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between group"
										>
											<div className="flex items-center gap-3">
												<span className="text-xs font-mono text-muted-foreground w-4">
													0{idx + 1}
												</span>
												<span className="text-sm font-medium">{p.product}</span>
											</div>
											<Badge
												variant="secondary"
												className="font-mono group-hover:bg-amber-100"
											>
												{p.count}
											</Badge>
										</div>
									))}
								</div>
							</div>
							<div className="space-y-4">
								<h4 className="text-sm font-medium flex items-center gap-2">
									<Tag className="h-4 w-4 text-amber-600" /> Popular Tags
								</h4>
								<div className="space-y-3">
									{data?.topTags.map((t, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between group"
										>
											<div className="flex items-center gap-3">
												<span className="text-xs font-mono text-muted-foreground w-4">
													0{idx + 1}
												</span>
												<span className="text-sm font-medium">{t.tag}</span>
											</div>
											<Badge
												variant="secondary"
												className="font-mono group-hover:bg-amber-100"
											>
												{t.count}
											</Badge>
										</div>
									))}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Campaigns */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Recent AI Campaigns</CardTitle>
						<CardDescription>Ready-to-use message templates.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data?.recentPromos.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-8">
									No campaigns yet. Use AI to generate some!
								</p>
							) : (
								data?.recentPromos.slice(0, 3).map((promo, idx) => (
									<div
										key={idx}
										className="flex flex-col gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
									>
										<div className="flex justify-between items-start">
											<h5 className="font-semibold text-sm line-clamp-1">
												{promo.theme}
											</h5>
											<span className="text-[10px] text-muted-foreground flex items-center shrink-0 ml-2">
												<Calendar className="mr-1 h-3 w-3" /> {promo.weekOf}
											</span>
										</div>
										<p className="text-xs text-muted-foreground line-clamp-2">
											{promo.message}
										</p>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 justify-start px-2 hover:bg-amber-100 hover:text-amber-900"
											onClick={() => copyToClipboard(promo.message)}
										>
											<Copy className="mr-2 h-3.5 w-3.5" />
											Copy Message
										</Button>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="grid gap-6">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Skeleton className="h-32" />
				<Skeleton className="h-32" />
				<Skeleton className="h-32" />
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<Skeleton className="h-100 lg:col-span-4" />
				<Skeleton className="h-100 lg:col-span-3" />
			</div>
		</div>
	);
}
