import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const profile = await prisma.profile.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Calculate stats specific to this profile
        let spentForThem = 0;
        let receivedFromThem = 0;

        profile.transactions.forEach(t => {
            if (t.type === 'DEBIT') spentForThem += t.amount;
            else if (t.type === 'CREDIT') receivedFromThem += t.amount;
        });

        const data = {
            ...profile,
            spentForThem,
            receivedFromThem,
            netBalance: spentForThem - receivedFromThem
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
