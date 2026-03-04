import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { listInterestTags } from "@/lib/data/customers";

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const tags = await listInterestTags();
	return NextResponse.json({ tags });
}
