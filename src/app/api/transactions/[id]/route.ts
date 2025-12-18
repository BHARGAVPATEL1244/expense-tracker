import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { id } = params;
        const { amount, type, date, description, category, paymentSource, profileId } = body;

        const transaction = await prisma.transaction.update({
            where: { id },
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
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.transaction.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
