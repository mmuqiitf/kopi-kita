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
