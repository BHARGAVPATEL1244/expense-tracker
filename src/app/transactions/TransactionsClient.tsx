"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Transaction {
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    date: string;
    description: string;
    category: string;
    paymentSource: string;
    profile?: { name: string };
}

export default function TransactionsClient() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        fetch("/api/transactions") // Default fetches recent
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTransactions(data);
                } else {
                    console.error("Failed to load transactions:", data);
                    setTransactions([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure?")) return;

        try {
            await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    const filtered = transactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase()) ||
        t.profile?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <Button asChild>
                    <Link href="/transactions/add">
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No transactions found.</div>
                ) : (
                    filtered.map((t) => (
                        <Card key={t.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex flex-col space-y-1">
                                    <div className="font-semibold">{t.description}</div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                        <span>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                                        <span>•</span>
                                        <span>{t.category || "Uncategorized"}</span>
                                        {t.profile && (
                                            <>
                                                <span>•</span>
                                                <span className="text-primary">{t.profile.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className={`font-bold text-lg ${t.type === 'CREDIT' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        asChild
                                    >
                                        <Link href={`/transactions/edit/${t.id}`}>
                                            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                        onClick={(e) => handleDelete(t.id, e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
