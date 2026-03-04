"use client";

export type ContactType = "email" | "phone" | "whatsapp";

export interface CustomerItem {
	id: string;
	name: string;
	contact: string;
	contactType: ContactType | null;
	favoriteProduct: string;
	tags: string[];
}

export interface FormState {
	name: string;
	contact: string;
	contactType: ContactType | "";
	favoriteProduct: string;
	tags: string[];
}
