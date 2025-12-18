"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { TransactionForm } from "@/components/TransactionForm";
import { use } from "react";

export default function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we'd fetch by ID. Here we might need a get-by-id API or just filter from list if cached.
        // I'll assume we can fetch all and find, or I should implement GET /api/transactions/[id]
        // Wait, I implemented DELETE /api/transactions/[id] and PUT, but not GET.
        // I should implement GET /api/transactions/[id] to make this cleaner, OR just use GET /api/transactions and filter (less efficient but works for small app).
        // Let's rely on finding it in the list for now or just implement the GET.
        // Actually, I can quickly implement GET in [id]/route.ts.
        fetch(`/api/transactions/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setTransaction(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                // router.push("/transactions");
            });
    }, [id, router]);

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update");

            router.push("/transactions");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to update transaction");
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;
    if (!transaction) return <div>Transaction not found</div>;

    return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/transactions">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Edit Transaction</h1>
            </div>

            <TransactionForm
                onSubmit={handleSubmit}
                submitLabel="Update Transaction"
                initialData={transaction}
            />
        </div>
    );
}
