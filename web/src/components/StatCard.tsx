import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = "neutral",
    icon: Icon,
    className,
}: StatCardProps) {
    return (
        <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm p-6", className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            </div>
            {change && (
                <p
                    className={cn(
                        "text-xs font-medium mt-1",
                        changeType === "positive" && "text-emerald-600",
                        changeType === "negative" && "text-rose-600",
                        changeType === "neutral" && "text-muted-foreground"
                    )}
                >
                    {change}
                </p>
            )}
        </div>
    );
}
