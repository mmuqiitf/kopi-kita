import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listRecentPromos } from "@/lib/data/promo";

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const promos = await listRecentPromos();
		return NextResponse.json({ promos });
	} catch (error) {
		console.error("Failed to fetch promos:", error);
		return NextResponse.json(
			{ error: "Failed to fetch promos" },
			{ status: 500 },
		);
	}
}
