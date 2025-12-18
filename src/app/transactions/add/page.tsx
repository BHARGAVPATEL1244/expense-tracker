"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TransactionForm } from "@/components/TransactionForm";

export default function AddTransactionPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to create");

            router.push("/transactions");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save transaction");
        }
    };

    return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/transactions">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Add Transaction</h1>
            </div>

            <TransactionForm onSubmit={handleSubmit} submitLabel="Save Transaction" />
        </div>
    );
}
