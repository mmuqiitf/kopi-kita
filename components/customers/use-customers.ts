"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomerItem } from "./types";

export function useCustomersQuery() {
	return useQuery<CustomerItem[]>({
		queryKey: ["customers"],
		queryFn: async () => {
			const res = await fetch("/api/customers");
			if (!res.ok) throw new Error("Failed to fetch customers");
			const json = await res.json();
			return json.customers;
		},
	});
}

export function useTagsQuery() {
	return useQuery<string[]>({
		queryKey: ["tags"],
		queryFn: async () => {
			const res = await fetch("/api/interests");
			if (!res.ok) throw new Error("Failed to fetch tags");
			const json = await res.json();
			return json.tags.map((t: { name: string }) => t.name);
		},
	});
}

export function useSaveCustomerMutation(editingCustomerId: string | null) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: Partial<CustomerItem>) => {
			const endpoint = "/api/customers";
			const method = editingCustomerId ? "PATCH" : "POST";
			const body = editingCustomerId
				? { id: editingCustomerId, ...payload }
				: payload;

			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) throw new Error("Request failed");
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
			queryClient.invalidateQueries({ queryKey: ["tags"] });
			toast.success(
				editingCustomerId ? "Customer updated!" : "Customer added!",
			);
		},
		onError: () => {
			toast.error("Could not save customer. Please check your inputs.");
		},
	});
}

export function useDeleteCustomerMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch("/api/customers", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!response.ok) throw new Error("Delete failed");
			return id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["customers"] });
			toast.success("Customer deleted.");
		},
		onError: () => {
			toast.error("Could not delete customer.");
		},
	});
}
