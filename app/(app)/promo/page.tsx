import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function PromoPage() {
	return (
		<Card className="rounded-none">
			<CardHeader>
				<CardTitle>Promo Ideas</CardTitle>
				<CardDescription>
					AI-generated campaign themes based on all customers will appear here.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Next step: connect trend aggregation + Groq generation endpoint.
				</p>
			</CardContent>
		</Card>
	);
}
