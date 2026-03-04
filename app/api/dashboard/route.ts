import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCustomerTrends, listRecentPromos } from "@/lib/data/promo";

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const trends = await getCustomerTrends();
		const recentPromos = await listRecentPromos({ weekOnly: true });

		return NextResponse.json({
			...trends,
			recentPromos,
		});
	} catch (error) {
		console.error("Dashboard API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard data" },
			{ status: 500 },
		);
	}
}
