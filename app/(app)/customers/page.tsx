import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function CustomersPage() {
	return (
		<Card className="rounded-none">
			<CardHeader>
				<CardTitle>Customers</CardTitle>
				<CardDescription>
					Customer CRUD, search, and interest filtering will live here.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Next step: implement table + add/edit/delete actions.
				</p>
			</CardContent>
		</Card>
	);
}
