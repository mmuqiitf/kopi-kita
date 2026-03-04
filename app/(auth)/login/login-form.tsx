"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const email = String(formData.get("email") ?? "");
		const password = String(formData.get("password") ?? "");

		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				toast.error("Invalid email or password.");
			} else {
				toast.success("Login successful! Welcome back.");
				router.push("/dashboard");
				router.refresh();
			}
		} catch {
			toast.error("An unexpected error occurred during login.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-sm">
			<Card>
				<CardHeader>
					<CardTitle>Welcome Back</CardTitle>
					<CardDescription>
						Sign in to manage customers and promos.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4" onSubmit={onSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									required
									placeholder="barista@kopikita.com"
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									required
									minLength={8}
									placeholder="••••••••"
								/>
							</Field>

							<Button type="submit" disabled={isLoading} className="w-full">
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
