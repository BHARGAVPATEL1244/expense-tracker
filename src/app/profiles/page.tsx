"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Profile {
    id: string;
    name: string;
    note?: string;
    netBalance: number;
    spentForThem: number;
    receivedFromThem: number;
}

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/profiles")
            .then((res) => res.json())
            .then((data) => {

                if (Array.isArray(data)) {
                    setProfiles(data);
                } else {
                    console.error("Profiles API returned non-array:", data);
                    setProfiles([]);
                }
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
                <Button asChild>
                    <Link href="/profiles/add">
                        <Plus className="mr-2 h-4 w-4" /> Add Profile
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-10">Loading...</div>
                ) : profiles.length === 0 ? (
                    <div className="col-span-full text-center py-10 space-y-4">
                        <Users className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">No profiles yet. Add people to track expenses with.</p>
                    </div>
                ) : (
                    profiles.map((p) => (
                        <Link key={p.id} href={`/profiles/${p.id}`}>
                            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{p.name}</div>
                                            {p.note && <div className="text-xs text-muted-foreground">{p.note}</div>}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Spent for them (You give):</span>
                                            <span className="text-rose-500 font-medium">₹{(p.spentForThem || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Received from them (You get):</span>
                                            <span className="text-emerald-500 font-medium">₹{(p.receivedFromThem || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-2 mt-2 border-t flex justify-between items-center">
                                            <span className="font-medium">Net Balance:</span>
                                            <div className="text-right">
                                                <div className="text-[10px] text-muted-foreground uppercase text-right">
                                                    {p.netBalance > 0 ? "Owes you" : p.netBalance < 0 ? "You owe" : "Settled"}
                                                </div>
                                                <div className={cn(
                                                    "font-bold text-lg",
                                                    p.netBalance > 0 ? "text-emerald-500" : p.netBalance < 0 ? "text-rose-500" : "text-muted-foreground"
                                                )}>
                                                    ₹{Math.abs(p.netBalance).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
