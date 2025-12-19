import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center space-x-2 font-bold", className)}>
            <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <span className="text-[10px] tracking-tighter font-extrabold leading-none">BET</span>
            </div>
            <span className="text-xl tracking-tight hidden md:inline-block">
                Expense<span className="text-emerald-500">Tracker</span>
            </span>
        </div>
    );
}
