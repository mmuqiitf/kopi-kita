export function buildPromoPrompt(input: {
	totalCustomers: number;
	topTags: Array<{ tag: string; count: number }>;
	topProducts: Array<{ product: string; count: number }>;
}) {
	const now = new Date();
	const day = now.getDay();
	const diffToMonday = (day + 6) % 7;
	now.setDate(now.getDate() - diffToMonday);
	now.setHours(0, 0, 0, 0);
	const currentWeekStart = now.toISOString().split("T")[0];

	return [
		"You are a marketing assistant for Mimi's Coffee Shop (Kopi Kita).",
		"Use the aggregate data to suggest exactly 3 global campaign ideas for this week.",
		"Return concise and practical output.",
		"Each campaign MUST include:",
		"- theme (string)",
		"- segmentDescription (string)",
		"- whyNow (string, why this is relevant based on current data)",
		"- message (1-2 friendly sentences + clear CTA, suitable for WhatsApp/IG)",
		"- bestTimeWindow (string or null, e.g., 'Weekday Mornings' or null if not specific)",
		"- targetCount (integer)",
		`- weekOf (string, use YYYY-MM-DD for the start of the current week: ${currentWeekStart})`,
		"",
		`Total customers: ${input.totalCustomers}`,
		`Top tags: ${JSON.stringify(input.topTags)}`,
		`Top products: ${JSON.stringify(input.topProducts)}`,
	].join("\n");
}
