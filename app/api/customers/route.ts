import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
	createCustomer,
	customerDeleteSchema,
	customerInputSchema,
	customerUpdateSchema,
	deleteCustomer,
	listCustomers,
	updateCustomer,
} from "@/lib/data/customers";

export async function GET(request: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const search = searchParams.get("search") ?? undefined;
	const tag = searchParams.get("tag") ?? undefined;

	const rows = await listCustomers({ search, tag });
	return NextResponse.json({ customers: rows });
}

export async function POST(request: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = customerInputSchema.safeParse(await request.json());
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const created = await createCustomer(parsed.data, session.user.id);
	return NextResponse.json({ customer: created }, { status: 201 });
}

export async function PATCH(request: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = customerUpdateSchema.safeParse(await request.json());
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	await updateCustomer(parsed.data);
	return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = customerDeleteSchema.safeParse(await request.json());
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	await deleteCustomer(parsed.data);
	return NextResponse.json({ ok: true });
}
