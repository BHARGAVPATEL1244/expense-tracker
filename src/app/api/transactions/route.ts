import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit');

        const transactions = await prisma.transaction.findMany({
            include: { profile: true },
            orderBy: { date: 'desc' },
            take: limit ? parseInt(limit) : undefined
        });

        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, type, date, description, category, paymentSource, profileId } = body;

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                type,
                date: new Date(date),
                description,
                category,
                paymentSource,
                profileId: profileId || null
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
