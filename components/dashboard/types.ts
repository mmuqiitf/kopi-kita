export interface PromoCampaign {
	id: string;
	theme: string;
	segmentDescription: string;
	whyNow: string;
	message: string;
	bestTimeWindow: string | null;
	targetCount: number;
	weekOf: string;
	generatedAt: string;
}

export interface DashboardData {
	totalCustomers: number;
	topProducts: { product: string; count: number }[];
	topTags: { tag: string; count: number }[];
	recentPromos: PromoCampaign[];
}
