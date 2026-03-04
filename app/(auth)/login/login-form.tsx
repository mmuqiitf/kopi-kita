"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

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
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const email = String(formData.get("email") ?? "");
		const password = String(formData.get("password") ?? "");

		setError(null);
		setIsLoading(true);

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		setIsLoading(false);

		if (result?.error) {
			setError("Invalid email or password.");
			return;
		}

		window.location.href = "/dashboard";
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

							{error ? (
								<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
									{error}
								</div>
							) : null}

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
