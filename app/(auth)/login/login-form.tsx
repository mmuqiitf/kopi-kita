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
import { Label } from "@/components/ui/label";

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
		<Card className="w-full max-w-sm rounded-none">
			<CardHeader>
				<CardTitle>Welcome to Kopi Kita</CardTitle>
				<CardDescription>Login to manage customers and promos.</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" onSubmit={onSubmit}>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" required />
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							minLength={8}
						/>
					</div>

					{error ? <p className="text-xs text-destructive">{error}</p> : null}

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
