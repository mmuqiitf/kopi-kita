import { CustomerItem } from "./customers-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface CustomerTableProps {
	customers: CustomerItem[];
	isFetching: boolean;
	deletingId: string | null;
	onEdit: (customer: CustomerItem) => void;
	onDelete: (id: string) => void;
}

export function CustomerTable({
	customers,
	isFetching,
	deletingId,
	onEdit,
	onDelete,
}: CustomerTableProps) {
	const isDisabled = isFetching || deletingId !== null;

	return (
		<div className="rounded-md border">
			<table className="w-full caption-bottom text-sm">
				<thead className="[&_tr]:border-b">
					<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
						<th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
							Name
						</th>
						<th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
							Favorite
						</th>
						<th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
							Contact
						</th>
						<th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
							Interests
						</th>
						<th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="[&_tr:last-child]:border-0">
					{isFetching && customers.length === 0 ? (
						Array.from({ length: 5 }).map((_, i) => (
							<tr key={i} className="border-b transition-colors">
								<td className="p-4 align-middle">
									<Skeleton className="h-4 w-[150px]" />
								</td>
								<td className="p-4 align-middle">
									<Skeleton className="h-4 w-[120px]" />
								</td>
								<td className="p-4 align-middle">
									<Skeleton className="h-4 w-[140px] mb-2" />
									<Skeleton className="h-3 w-[60px]" />
								</td>
								<td className="p-4 align-middle flex gap-2">
									<Skeleton className="h-5 w-[80px] rounded-full" />
								</td>
								<td className="p-4 align-middle">
									<Skeleton className="h-8 w-[130px]" />
								</td>
							</tr>
						))
					) : customers.length > 0 ? (
						customers.map((customer) => (
							<tr
								key={customer.id}
								className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
							>
								<td className="p-4 align-middle font-medium">
									{customer.name}
								</td>
								<td className="p-4 align-middle">{customer.favoriteProduct}</td>
								<td className="p-4 align-middle">
									{customer.contact ? (
										<div>
											<p>{customer.contact}</p>
											<p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
												{customer.contactType ?? "-"}
											</p>
										</div>
									) : (
										"-"
									)}
								</td>
								<td className="p-4 align-middle">
									<div className="flex flex-wrap gap-1">
										{customer.tags.length > 0 ? (
											customer.tags.map((tag) => (
												<Badge
													key={`${customer.id}-${tag}`}
													variant="secondary"
												>
													{tag}
												</Badge>
											))
										) : (
											<span className="text-muted-foreground italic text-sm">
												No tags
											</span>
										)}
									</div>
								</td>
								<td className="p-4 align-middle">
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
											{deletingId === customer.id ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Deleting
												</>
											) : (
												"Delete"
											)}
										</Button>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								className="p-4 align-middle text-center text-muted-foreground h-24"
								colSpan={5}
							>
								No customers found for this criteria.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
