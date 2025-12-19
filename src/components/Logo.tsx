import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center space-x-2 font-bold", className)}>
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-5 w-5"
                >
                    <path d="M4 7h11a4 4 0 0 1 0 8H9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15h11a4 4 0 0 1 0 8H9" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="4" y1="7" x2="4" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span className="text-xl tracking-tight hidden md:inline-block">BET</span>
        </div>
    );
}
