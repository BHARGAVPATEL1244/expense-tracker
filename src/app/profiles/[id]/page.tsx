"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    date: string;
    description: string;
    category: string;
}

interface Profile {
    id: string;
    name: string;
    note?: string;
    netBalance: number;
    spentForThem: number;
    receivedFromThem: number;
    transactions: Transaction[];
}

export default function ProfileDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Unwrap params
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/profiles/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading || !profile) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/profiles">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Spent for them
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">
                            ₹{profile.spentForThem.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Received from them
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            ₹{profile.receivedFromThem.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Net Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-bold",
                            profile.netBalance > 0 ? "text-emerald-500" : profile.netBalance < 0 ? "text-rose-500" : "text-muted-foreground"
                        )}>
                            {profile.netBalance > 0 ? "+" : ""}{profile.netBalance.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {profile.netBalance > 0 ? "They owe you" : profile.netBalance < 0 ? "You owe them" : "Settled"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions List */}
            <h2 className="text-xl font-semibold mt-8">History</h2>
            <div className="space-y-4">
                {profile.transactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No transactions found.</div>
                ) : (
                    profile.transactions.map((t) => (
                        <Card key={t.id} className="overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex flex-col space-y-1">
                                    <div className="font-semibold">{t.description}</div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                        <span>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                                        <span>•</span>
                                        <span>{t.category || "Uncategorized"}</span>
                                    </div>
                                </div>
                                <div className={`font-bold text-lg ${t.type === 'CREDIT' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
