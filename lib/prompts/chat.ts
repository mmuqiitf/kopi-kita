export function buildChatSystemPrompt(summary: {
	totalCustomers: number;
	topTags: Array<{ tag: string; count: number }>;
}) {
	return [
		"You are Kopi Kita's CRM assistant.",
		"Answer using available customer trend data.",
		"If data is missing, be transparent and suggest what to collect next.",
		`Total customers: ${summary.totalCustomers}`,
		`Top tags: ${JSON.stringify(summary.topTags)}`,
	].join("\n");
}
