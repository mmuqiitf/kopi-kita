"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PromoCampaign } from "./types";

export function usePromosQuery() {
	return useQuery<PromoCampaign[]>({
		queryKey: ["promos"],
		queryFn: async () => {
			const res = await fetch("/api/promo");
			if (!res.ok) throw new Error("Failed to fetch past promos");
			const json = await res.json();
			return json.promos;
		},
	});
}

export function useGeneratePromoMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/promo/generate", { method: "POST" });
			const json = await res.json();

			if (!res.ok) {
				throw new Error(json.message || "Failed to generate promos");
			}
			return json.campaigns as PromoCampaign[];
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["promos"] });
			toast.success("Successfully generated new promotional ideas!");
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		},
	});
}
