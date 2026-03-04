import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
	return (
		<div className="grid gap-4">
			<Card className="rounded-none">
				<CardHeader>
					<CardTitle>Dashboard</CardTitle>
					<CardDescription>
						Overview and weekly campaign summary will be shown here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Foundation complete. Dashboard widgets are next.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
