import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Users, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="grid gap-6">
			{/* Dashboard Title */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of how your artisanal coffee campaigns are performing this
					week.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Customers
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2,345</div>
						<p className="text-xs text-muted-foreground mt-1">
							+12% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Promos</CardTitle>
						<Sparkles className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground mt-1">
							2 ending this week
						</p>
					</CardContent>
				</Card>

				<Card className="md:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Weekly Engagement
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">84%</div>
						<p className="text-xs text-muted-foreground mt-1">
							+4% from last week
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Activity data will populate here.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex h-32 items-center justify-center rounded-md border border-dashed">
							<p className="text-sm text-muted-foreground">
								No recent activity to show
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>AI Insights</CardTitle>
						<CardDescription>
							Suggestions powered by your customer data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4">
							<div className="flex items-start gap-3 rounded-md border p-4">
								<Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
								<div>
									<h4 className="font-semibold leading-none tracking-tight">
										New Trend: Oat Milk Lattes
									</h4>
									<p className="text-sm text-muted-foreground mt-2">
										We&apos;ve noticed a 20% increase in tags for &apos;oat
										milk&apos;. Consider running a targeted weekend promo.
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
