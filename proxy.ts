import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export default auth((request) => {
	const pathname = request.nextUrl.pathname;
	const isAuthed = Boolean(request.auth?.user);

	const isAuthRoute = pathname === "/login" || pathname.startsWith("/api/auth");

	if (!isAuthed && !isAuthRoute) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	if (isAuthed && pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
