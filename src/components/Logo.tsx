import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center space-x-3 font-bold", className)}>
            <div className="relative h-10 w-10">
                <Image
                    src="/logo.png"
                    alt="BET Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <span className="text-xl tracking-tight hidden md:inline-block">
                Expense<span className="text-emerald-500">Tracker</span>
            </span>
        </div>
    );
}
