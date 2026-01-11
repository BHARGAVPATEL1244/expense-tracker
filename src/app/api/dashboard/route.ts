import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        try {
            // Test connection first
            try {
                await prisma.$queryRaw`SELECT 1`;
            } catch (dbError) {
                console.error("Database connection failed:", dbError);
                return NextResponse.json({
                    error: "Database Connection Error",
                    details: "Check DATABASE_URL environment variable. " + String(dbError)
                }, { status: 500 });
            }

            const transactions = await prisma.transaction.findMany();

            let totalCredit = 0;
            let totalDebit = 0;

            // Monthly stats
            const monthlyStats: Record<string, { credit: number, debit: number }> = {};
            const categoryStats: Record<string, number> = {};

            transactions.forEach(t => {
                try {
                    if (t.type === 'CREDIT') totalCredit += t.amount;
                    else if (t.type === 'DEBIT') totalDebit += t.amount;

                    // Monthly
                    // Safe date check
                    const dateObj = new Date(t.date);
                    if (!isNaN(dateObj.getTime())) {
                        const month = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
                        if (!monthlyStats[month]) monthlyStats[month] = { credit: 0, debit: 0 };
                        if (t.type === 'CREDIT') monthlyStats[month].credit += t.amount;
                        else monthlyStats[month].debit += t.amount;
                    }

                    // Category
                    if (t.type === 'DEBIT' && t.category) {
                        categoryStats[t.category] = (categoryStats[t.category] || 0) + t.amount;
                    }
                } catch (e) {
                    console.warn("Skipping malformed transaction:", t.id, e);
                }
            });

            // Determine pending from profiles
            const profiles = await prisma.profile.findMany({ include: { transactions: true } });
            let totalPendingFromProfiles = 0;
            let totalOweToProfiles = 0;

            profiles.forEach(p => {
                try {
                    let spent = 0;
                    let received = 0;
                    p.transactions.forEach(t => {
                        if (t.type === 'DEBIT') spent += t.amount;
                        else if (t.type === 'CREDIT') received += t.amount;
                    });
                    const net = spent - received;
                    if (net > 0) totalPendingFromProfiles += net;
                    else totalOweToProfiles += Math.abs(net);
                } catch (e) {
                    console.warn("Skipping malformed profile:", p.id, e);
                }
            });

            return NextResponse.json({
                balance: totalCredit - totalDebit,
                totalCredit,
                totalDebit,
                totalPendingFromProfiles,
                totalOweToProfiles,
                monthlyStats,
                categoryStats
            });
        } catch (error) {
            console.error("Dashboard API Error:", error);
            return NextResponse.json({ error: "Failed to fetch dashboard data", details: String(error) }, { status: 500 });
        }
    }
