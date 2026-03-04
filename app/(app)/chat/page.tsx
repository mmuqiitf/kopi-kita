import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ChatPage() {
	return (
		<Card className="rounded-none">
			<CardHeader>
				<CardTitle>AI Chat</CardTitle>
				<CardDescription>
					Ask questions about customer trends and promo strategy.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Next step: add streaming chat connected to current data.
				</p>
			</CardContent>
		</Card>
	);
}
