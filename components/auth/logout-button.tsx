"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function LogoutButton() {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className="text-muted-foreground hover:text-foreground"
			onClick={async () => {
				toast.info("Logging out...");
				await signOut({ callbackUrl: "/login" });
			}}
		>
			<LogOut className="h-5 w-5" />
		</Button>
	);
}
