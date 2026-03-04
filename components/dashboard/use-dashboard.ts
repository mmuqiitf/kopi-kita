"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "./types";

export function useDashboardQuery() {
	return useQuery<DashboardData>({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const res = await fetch("/api/dashboard");
			if (!res.ok) throw new Error("Failed to load dashboard data");
			return res.json();
		},
	});
}
