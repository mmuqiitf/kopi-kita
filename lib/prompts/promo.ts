export function buildPromoPrompt(input: {
	totalCustomers: number;
	topTags: Array<{ tag: string; count: number }>;
	topProducts: Array<{ product: string; count: number }>;
}) {
	return [
		"You are a marketing assistant for Mimi's Coffee Shop (Kopi Kita).",
		"Use the aggregate data to suggest exactly 3 global campaign ideas for this week.",
		"Return concise and practical output.",
		"Each campaign should include:",
		"- theme",
		"- segmentDescription",
		"- whyNow",
		"- message (1-2 friendly sentences + CTA)",
		"- bestTimeWindow (optional)",
		"- targetCount",
		"",
		`Total customers: ${input.totalCustomers}`,
		`Top tags: ${JSON.stringify(input.topTags)}`,
		`Top products: ${JSON.stringify(input.topProducts)}`,
	].join("\n");
}
