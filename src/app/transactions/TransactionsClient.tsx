"use client";

import { useEffect, useState } from "react";

interface Transaction {
    id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    date: string;
    description: string;
    category?: string;
    paymentSource?: string;
    profile?: { name: string };
}

export default function TransactionsClient() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/transactions")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTransactions(data);
                } else {
                    console.error("Transactions API returned non-array:", data);
                    setTransactions([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (transactions.length === 0) return <p>No transactions found.</p>;

    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>
                        <strong>{t.description}</strong> – {t.type} – ₹{t.amount} – {new Date(t.date).toLocaleDateString()}
                        {t.category && <span> – Category: {t.category}</span>}
                        {t.profile && <span> – Profile: {t.profile.name}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
