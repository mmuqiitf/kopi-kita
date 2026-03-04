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
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Promo Generation Central
					</h2>
					<p className="text-muted-foreground mt-1 text-sm max-w-2xl">
						Your AI-powered marketing assistant. We analyze current customer
						trends to build high-converting global campaigns.
					</p>
				</div>
				<Button
					onClick={() => generateMutation.mutate()}
					disabled={generateMutation.isPending}
					className="shrink-0 group"
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
							className="flex flex-col rounded-none group hover:border-amber-500/50 transition-colors duration-300"
						>
							<CardHeader className="pb-3 border-b border-border/40 relative overflow-hidden bg-muted/10">
								<div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500 via-orange-400 to-amber-200 opacity-20 group-hover:opacity-100 transition-opacity" />

								<div className="flex justify-between items-start mb-3 mt-1">
									<Badge
										variant="outline"
										className="font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
									>
										{promo.targetCount} targets
									</Badge>
									<span className="text-xs font-mono text-muted-foreground flex items-center bg-background px-2 py-0.5 rounded-full border">
										<Calendar className="mr-1.5 h-3 w-3 text-amber-600" />
										Week of {promo.weekOf}
									</span>
								</div>
								<CardTitle className="text-xl line-clamp-2 leading-tight">
									{promo.theme}
								</CardTitle>
								<CardDescription className="line-clamp-2 min-h-10 mt-2 text-xs">
									{promo.segmentDescription}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 pt-5 pb-4">
								<div className="space-y-5">
									<div>
										<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-2">
											Why Now?
										</p>
										<p className="text-sm border-l-2 border-amber-500/50 pl-3 italic text-foreground/80 leading-relaxed">
											&quot;{promo.whyNow}&quot;
										</p>
									</div>
									<div className="grid grid-cols-1 gap-2 border-t pt-4">
										{promo.bestTimeWindow && (
											<div className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-md">
												<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
													Best Time
												</p>
												<p className="text-xs font-medium">
													{promo.bestTimeWindow}
												</p>
											</div>
										)}
									</div>
									<div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-lg relative text-sm border border-amber-100 dark:border-amber-900/50 font-medium">
										{promo.message}
									</div>
								</div>
							</CardContent>
							<CardFooter className="pt-2 pb-4 px-6 border-t border-border/40 bg-muted/5">
								<Button
									variant="secondary"
									className="w-full transition-all group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 hover:text-amber-900 dark:hover:text-amber-100"
									onClick={() => copyToClipboard(promo.message)}
								>
									<Copy className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-500" />
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
