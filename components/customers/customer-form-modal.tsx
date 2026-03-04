import { ContactType, FormState } from "./customers-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface CustomerFormModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	formState: FormState;
	setFormState: React.Dispatch<React.SetStateAction<FormState>>;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	isSaving: boolean;
	editingCustomerId: string | null;
	error: string | null;
}

export function CustomerFormModal({
	isOpen,
	onOpenChange,
	formState,
	setFormState,
	onSubmit,
	isSaving,
	editingCustomerId,
	error,
}: CustomerFormModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={isSaving ? undefined : onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{editingCustomerId ? "Edit Customer" : "Add Customer"}
					</DialogTitle>
					<DialogDescription>
						{editingCustomerId
							? "Make changes to the customer profile here."
							: "Add a new customer to your CRM."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								value={formState.name}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										name: event.target.value,
									}))
								}
								required
								disabled={isSaving}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="favoriteProduct">
								Favorite product
							</FieldLabel>
							<Input
								id="favoriteProduct"
								value={formState.favoriteProduct}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										favoriteProduct: event.target.value,
									}))
								}
								required
								disabled={isSaving}
							/>
						</Field>

						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor="contact">Contact</FieldLabel>
								<Input
									id="contact"
									value={formState.contact}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											contact: event.target.value,
										}))
									}
									disabled={isSaving}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="contactType">Type</FieldLabel>
								<Select
									value={formState.contactType || "none"}
									onValueChange={(val) =>
										setFormState((prev) => ({
											...prev,
											contactType: val === "none" ? "" : (val as ContactType),
										}))
									}
									disabled={isSaving}
								>
									<SelectTrigger id="contactType">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="none">None</SelectItem>
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="phone">Phone</SelectItem>
											<SelectItem value="whatsapp">WhatsApp</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
						</div>

						<Field>
							<FieldLabel htmlFor="tags">
								Interest tags (comma separated)
							</FieldLabel>
							<Input
								id="tags"
								placeholder="sweet drinks, caramel, oat milk"
								value={formState.tagsInput}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										tagsInput: event.target.value,
									}))
								}
								disabled={isSaving}
							/>
						</Field>

						{error ? (
							<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
								{error}
							</div>
						) : null}

						<Field orientation="horizontal" className="pt-4 justify-end">
							<Button
								type="button"
								variant="outline"
								disabled={isSaving}
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : editingCustomerId ? (
									"Save changes"
								) : (
									"Add customer"
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
