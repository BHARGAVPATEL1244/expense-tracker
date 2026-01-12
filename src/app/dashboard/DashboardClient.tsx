"use client";

import { useEffect, useState } from "react";

interface DashboardData {
    balance: number;
    totalCredit: number;
    totalDebit: number;
    totalPendingFromProfiles: number;
    totalOweToProfiles: number;
    monthlyStats: Record<string, { credit: number; debit: number }>;
    categoryStats: Record<string, number>;
}

export default function DashboardClient() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Failed to load data</p>;

    return (
        <div>
            <h2>Dashboard</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
