"use client";

import { toast } from "sonner";
import { Sparkles, Copy, Loader2, Calendar } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PromoCampaign } from "./types";
import { usePromosQuery, useGeneratePromoMutation } from "./use-promo";

export default function PromoManager() {
	const { data: promos = [], isLoading } = usePromosQuery();
	const generateMutation = useGeneratePromoMutation();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Message copied to clipboard!");
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Promo Generation
					</h1>
					<p className="text-muted-foreground max-w-2xl">
						AI-powered marketing assistant analyzing current customer trends.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => generateMutation.mutate()}
					disabled={generateMutation.isPending}
					className="shrink-0 group shadow-lg shadow-amber-500/10"
				>
					{generateMutation.isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Mining trends...
						</>
					) : (
						<>
							<Sparkles className="mr-2 h-4 w-4 group-hover:text-amber-300 transition-colors text-amber-500" />
							Generate New Promos
						</>
					)}
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Card key={i} className="flex flex-col h-full rounded-none">
							<CardHeader>
								<Skeleton className="h-6 w-3/4 mb-2" />
								<Skeleton className="h-4 w-1/2" />
							</CardHeader>
							<CardContent className="flex-1 space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-20 w-full" />
							</CardContent>
						</Card>
					))
				) : promos.length === 0 ? (
					<div className="col-span-full py-16 text-center border-2 border-dashed border-muted rounded-xl bg-muted/10">
						<Sparkles className="mx-auto h-8 w-8 text-amber-500/50 mb-4 opacity-70" />
						<p className="text-muted-foreground text-lg mb-4">
							No promotional campaigns generated yet.
						</p>
						<Button
							onClick={() => generateMutation.mutate()}
							variant="outline"
							disabled={generateMutation.isPending}
						>
							{generateMutation.isPending
								? "Generating..."
								: "Generate your first promo"}
						</Button>
					</div>
				) : (
					promos.map((promo: PromoCampaign) => (
						<Card
							key={promo.id}
							className="flex flex-col group hover:ring-amber-500/50 transition-all duration-300"
						>
							<CardHeader className="relative overflow-hidden border-b pb-4">
								<div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-600 via-amber-400 to-amber-200 opacity-30 group-hover:opacity-100 transition-opacity" />

								<div className="flex justify-between items-start pt-2">
									<Badge
										variant="secondary"
										className="bg-amber-100 text-amber-900 border-amber-200 group-hover:bg-amber-200"
									>
										{promo.targetCount} targets
									</Badge>
									<span className="text-[10px] font-mono text-muted-foreground flex items-center bg-muted/50 px-2 py-0.5 border">
										<Calendar className="mr-1 h-3 w-3 text-amber-600" />
										{promo.weekOf}
									</span>
								</div>
								<CardTitle className="text-lg font-bold mt-4 leading-tight">
									{promo.theme}
								</CardTitle>
								<CardDescription className="line-clamp-2 text-xs mt-1">
									{promo.segmentDescription}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 py-5">
								<div className="space-y-6">
									<div className="space-y-2">
										<p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/70">
											Campaign Insight
										</p>
										<p className="text-xs border-l-2 border-amber-500 pl-3 italic text-foreground leading-relaxed">
											&quot;{promo.whyNow}&quot;
										</p>
									</div>

									{promo.bestTimeWindow && (
										<div className="flex justify-between items-center bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 border border-amber-100/50">
											<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
												Best Time
											</p>
											<p className="text-xs font-semibold text-amber-900">
												{promo.bestTimeWindow}
											</p>
										</div>
									)}

									<div className="bg-muted/30 p-4 border relative text-xs leading-relaxed font-medium">
										{promo.message}
										<div className="absolute -top-2 -left-2 bg-background border p-1 scale-75">
											<Sparkles className="h-3 w-3 text-amber-500" />
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className="pt-0 pb-4">
								<Button
									variant="secondary"
									className="w-full h-9 hover:bg-amber-100 hover:text-amber-900 transition-colors border shadow-sm"
									onClick={() => copyToClipboard(promo.message)}
								>
									<Copy className="mr-2 h-4 w-4 text-amber-600" />
									Copy Message
								</Button>
							</CardFooter>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
