"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Profile {
    id: string;
    name: string;
}

interface TransactionFormProps {
    initialData?: {
        amount: number;
        type: "CREDIT" | "DEBIT";
        description: string;
        date: string;
        profileId?: string | null;
        category?: string | null;
        paymentSource?: string | null;
    };
    onSubmit: (data: any) => Promise<void>;
    submitLabel: string;
}

export function TransactionForm({ initialData, onSubmit, submitLabel }: TransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
    const [type, setType] = useState<"CREDIT" | "DEBIT">(initialData?.type || "DEBIT");
    const [description, setDescription] = useState(initialData?.description || "");
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [profileId, setProfileId] = useState(initialData?.profileId || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [paymentSource, setPaymentSource] = useState(initialData?.paymentSource || "");

    useEffect(() => {
        fetch("/api/profiles")
            .then((res) => res.json())
            .then((data) => setProfiles(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                amount: parseFloat(amount),
                type,
                description,
                date,
                profileId: profileId || null,
                category,
                paymentSource
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant={type === 'DEBIT' ? 'destructive' : 'outline'}
                            onClick={() => setType('DEBIT')}
                            className="w-full"
                        >
                            Debit (-)
                        </Button>
                        <Button
                            type="button"
                            variant={type === 'CREDIT' ? 'default' : 'outline'}
                            className={type === "CREDIT" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                            onClick={() => setType('CREDIT')}
                        >
                            Credit (+)
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            required
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            required
                            placeholder="What is this for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="block w-full appearance-none bg-background text-base" // text-base ensures 16px on mobile to prevent zoom
                                style={{
                                    WebkitAppearance: "none", // Fix iOS styling
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category (Optional)</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Bills">Bills</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Health">Health</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Linked Profile (Optional)</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={profileId}
                                onChange={(e) => setProfileId(e.target.value)}
                            >
                                <option value="">None (Personal Expense)</option>
                                {profiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Source</label>
                            <Input
                                placeholder="Google Pay, Cash, HDFC..."
                                value={paymentSource}
                                onChange={(e) => setPaymentSource(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
