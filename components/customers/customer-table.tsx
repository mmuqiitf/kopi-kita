"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CustomerItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const getColumns = (
	onEdit: (customer: CustomerItem) => void,
	onDelete: (id: string) => void,
	deletingId: string | null,
	isFetching: boolean,
): ColumnDef<CustomerItem>[] => [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
	},
	{
		accessorKey: "favoriteProduct",
		header: "Favorite",
	},
	{
		accessorKey: "contact",
		header: "Contact",
		cell: ({ row }) => {
			const customer = row.original;
			if (!customer.contact) return "-";
			return (
				<div>
					<p>{customer.contact}</p>
					<p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
						{customer.contactType ?? "-"}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "tags",
		header: "Interests",
		cell: ({ row }) => {
			const tags = row.original.tags;
			return (
				<div className="flex flex-wrap gap-1">
					{tags.length > 0 ? (
						tags.map((tag) => (
							<Badge key={`${row.original.id}-${tag}`} variant="secondary">
								{tag}
							</Badge>
						))
					) : (
						<span className="text-muted-foreground italic text-sm">
							No tags
						</span>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const customer = row.original;
			const isDeletingThis = deletingId === customer.id;
			const isDisabled = isFetching || deletingId !== null;

			return (
				<div className="flex gap-2">
					<Button
						type="button"
						size="sm"
						variant="outline"
						disabled={isDisabled}
						onClick={() => onEdit(customer)}
					>
						Edit
					</Button>
					<Button
						type="button"
						size="sm"
						variant="destructive"
						disabled={isDisabled}
						onClick={() => onDelete(customer.id)}
					>
						{isDeletingThis ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting
							</>
						) : (
							"Delete"
						)}
					</Button>
				</div>
			);
		},
	},
];
