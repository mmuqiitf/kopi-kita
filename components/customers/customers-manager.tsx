"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CustomerFormModal } from "./customer-form-modal";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./customer-table";
import { ContactType, CustomerItem, FormState } from "./types";
import {
	useCustomersQuery,
	useTagsQuery,
	useSaveCustomerMutation,
	useDeleteCustomerMutation,
} from "./use-customers";

const initialFormState: FormState = {
	name: "",
	contact: "",
	contactType: "",
	favoriteProduct: "",
	tagsInput: "",
};

export default function CustomersManager() {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState("all");
	const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formState, setFormState] = useState<FormState>(initialFormState);

	// --- Custom Hooks ---
	const { data: tags = [] } = useTagsQuery();
	const { data: allCustomers = [], isFetching } = useCustomersQuery();
	const deleteMutation = useDeleteCustomerMutation();
	const saveMutation = useSaveCustomerMutation(editingCustomerId);

	// --- Handlers ---
	const resetForm = () => {
		setFormState(initialFormState);
		setEditingCustomerId(null);
	};

	const onEdit = (customer: CustomerItem) => {
		setEditingCustomerId(customer.id);
		setFormState({
			name: customer.name,
			contact: customer.contact || "",
			contactType: customer.contactType || "",
			favoriteProduct: customer.favoriteProduct || "",
			tagsInput: customer.tags.join(", "),
		});
		setIsModalOpen(true);
	};

	const onDelete = (id: string) => {
		const shouldDelete = window.confirm("Delete this customer?");
		if (shouldDelete) {
			deleteMutation.mutate(id);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const t = formState.tagsInput
			.split(",")
			.map((x) => x.trim())
			.filter(Boolean);

		saveMutation.mutate(
			{
				name: formState.name,
				contact: formState.contact,
				contactType: (formState.contactType as ContactType) || null,
				favoriteProduct: formState.favoriteProduct,
				tags: t,
			},
			{
				onSuccess: () => {
					setIsModalOpen(false);
					resetForm();
				},
			},
		);
	};

	// --- Derived Data ---
	const filteredCustomers = allCustomers.filter((c) => {
		const matchesSearch =
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.contact?.toLowerCase().includes(search.toLowerCase());
		const matchesFilter =
			activeFilter === "all" || c.tags.includes(activeFilter);
		return matchesSearch && matchesFilter;
	});

	const columns = getColumns(
		onEdit,
		onDelete,
		deleteMutation.variables || null,
		isFetching || deleteMutation.isPending,
	);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-wrap gap-4">
					<CardTitle className="text-xl font-bold">
						Customers Directory
					</CardTitle>
					<Button
						onClick={() => {
							resetForm();
							setIsModalOpen(true);
						}}
					>
						Add Customer
					</Button>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by name or contact..."
								className="pl-8"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 mb-6">
						<Button
							type="button"
							variant={activeFilter === "all" ? "default" : "secondary"}
							size="sm"
							onClick={() => setActiveFilter("all")}
						>
							All ({allCustomers.length})
						</Button>
						{tags.map((tag) => {
							const count = allCustomers.filter((c) =>
								c.tags.includes(tag),
							).length;
							return (
								<Button
									key={tag}
									type="button"
									variant={activeFilter === tag ? "default" : "secondary"}
									size="sm"
									onClick={() => setActiveFilter(tag)}
								>
									{tag} ({count})
								</Button>
							);
						})}
					</div>

					<DataTable
						columns={columns}
						data={filteredCustomers}
						isLoading={isFetching}
					/>
				</CardContent>
			</Card>

			<CustomerFormModal
				isOpen={isModalOpen}
				onOpenChange={(val) => {
					if (!val) resetForm();
					setIsModalOpen(val);
				}}
				formState={formState}
				setFormState={setFormState}
				onSubmit={onSubmit}
				isSaving={saveMutation.isPending}
				editingCustomerId={editingCustomerId}
				error={saveMutation.isError ? saveMutation.error.message : null}
			/>
		</div>
	);
}
