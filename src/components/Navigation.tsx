"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: Wallet },
    { label: "Profiles", href: "/profiles", icon: Users },
];

export function Navigation() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.reload();
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-card/80 backdrop-blur-lg md:relative md:border-t-0 md:bg-transparent md:block">
            <div className="flex h-16 items-center justify-around md:justify-center md:space-x-8">
                {items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary md:flex-row md:space-y-0 md:space-x-2 md:text-sm",
                                isActive && "text-primary"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "stroke-primary")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive md:flex-row md:space-y-0 md:space-x-2 md:text-sm"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}
