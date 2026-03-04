"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { CustomerTable } from "./customer-table";
import { CustomerFormModal } from "./customer-form-modal";

export type ContactType = "email" | "phone" | "whatsapp";

export type CustomerItem = {
	id: string;
	name: string;
	contact: string | null;
	contactType: ContactType | null;
	favoriteProduct: string;
	createdAt: string;
	tags: string[];
};

export type TagItem = {
	id: number;
	name: string;
};

export type FormState = {
	name: string;
	contact: string;
	contactType: ContactType | "";
	favoriteProduct: string;
	tagsInput: string;
};

const initialFormState: FormState = {
	name: "",
	contact: "",
	contactType: "",
	favoriteProduct: "",
	tagsInput: "",
};

function parseTags(input: string) {
	return Array.from(
		new Set(
			input
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean),
		),
	);
}

export function CustomersManager() {
	const [customers, setCustomers] = useState<CustomerItem[]>([]);
	const [tags, setTags] = useState<TagItem[]>([]);
	const [search, setSearch] = useState("");
	const [selectedTag, setSelectedTag] = useState("all");
	const [formState, setFormState] = useState<FormState>(initialFormState);
	const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchCustomers = useCallback(async () => {
		const params = new URLSearchParams();
		if (search.trim()) params.set("search", search.trim());
		if (selectedTag && selectedTag !== "all") params.set("tag", selectedTag);

		const response = await fetch(`/api/customers?${params.toString()}`, {
			method: "GET",
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Failed to load customers");
		}

		const payload = await response.json();
		setCustomers(payload.customers ?? []);
	}, [search, selectedTag]);

	const fetchTags = useCallback(async () => {
		const response = await fetch("/api/interests", {
			method: "GET",
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Failed to load interests");
		}

		const payload = await response.json();
		setTags(payload.tags ?? []);
	}, []);

	const refreshAll = useCallback(async () => {
		setIsFetching(true);
		setError(null);
		try {
			await Promise.all([fetchCustomers(), fetchTags()]);
		} catch {
			setError("Unable to fetch customer data right now.");
		} finally {
			setIsFetching(false);
		}
	}, [fetchCustomers, fetchTags]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			void fetchCustomers().catch(() => {
				setError("Unable to fetch customer data right now.");
			});
		}, 250);

		return () => clearTimeout(timeout);
	}, [fetchCustomers]);

	useEffect(() => {
		void fetchTags().catch(() => {
			setError("Unable to load interests.");
		});
	}, [fetchTags]);

	const totalCustomers = useMemo(() => customers.length, [customers]);

	const resetForm = () => {
		setFormState(initialFormState);
		setEditingCustomerId(null);
		setError(null);
	};

	const handleOpenModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		const payload = {
			name: formState.name,
			contact: formState.contact || null,
			contactType: formState.contactType || null,
			favoriteProduct: formState.favoriteProduct,
			tags: parseTags(formState.tagsInput),
		};

		const endpoint = "/api/customers";
		const method = editingCustomerId ? "PATCH" : "POST";
		const body = editingCustomerId
			? { id: editingCustomerId, ...payload }
			: payload;

		setIsSaving(true);
		try {
			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error("Request failed");
			}

			resetForm();
			setIsModalOpen(false);
			await refreshAll();
		} catch {
			setError("Could not save customer. Please check your input.");
		} finally {
			setIsSaving(false);
		}
	};

	const onEdit = (customer: CustomerItem) => {
		setEditingCustomerId(customer.id);
		setFormState({
			name: customer.name,
			contact: customer.contact ?? "",
			contactType: customer.contactType ?? "",
			favoriteProduct: customer.favoriteProduct,
			tagsInput: customer.tags.join(", "),
		});
		setError(null);
		setIsModalOpen(true);
	};

	const onDelete = async (id: string) => {
		const shouldDelete = window.confirm("Delete this customer?");
		if (!shouldDelete) {
			return;
		}

		setDeletingId(id);
		setError(null);

		try {
			const response = await fetch("/api/customers", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error("Delete failed");
			}

			await refreshAll();
		} catch {
			setError("Could not delete customer.");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Customers ({totalCustomers})</CardTitle>
					<CardDescription>
						Manage, search, and filter your customer database.
					</CardDescription>
					<CardAction>
						<Button onClick={handleOpenModal}>
							<PlusIcon className="mr-2 h-4 w-4" /> Add Customer
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								className="pl-9"
								placeholder="Search by name or favorite product..."
								value={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
						</div>
						<div className="w-full sm:w-48 relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
								<FilterIcon className="h-4 w-4 text-muted-foreground" />
							</div>
							<Select value={selectedTag} onValueChange={setSelectedTag}>
								<SelectTrigger className="pl-9">
									<SelectValue placeholder="All interests" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="all">All interests</SelectItem>
										{tags.map((tag) => (
											<SelectItem key={tag.id} value={tag.name}>
												{tag.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					<CustomerTable
						customers={customers}
						isFetching={isFetching}
						deletingId={deletingId}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</CardContent>
			</Card>

			<CustomerFormModal
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				formState={formState}
				setFormState={setFormState}
				onSubmit={onSubmit}
				isSaving={isSaving}
				editingCustomerId={editingCustomerId}
				error={error}
			/>
		</div>
	);
}
