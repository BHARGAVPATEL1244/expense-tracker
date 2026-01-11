import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    export async function GET() {
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

            const profiles = await prisma.profile.findMany({
                include: { transactions: true },
                orderBy: { name: 'asc' }
            });

            const profilesWithBalance = profiles.map(p => {
                let spentForThem = 0;
                let receivedFromThem = 0;

                p.transactions.forEach(t => {
                    if (t.type === 'DEBIT') spentForThem += t.amount;
                    else if (t.type === 'CREDIT') receivedFromThem += t.amount;
                });

                return {
                    ...p,
                    spentForThem,
                    receivedFromThem,
                    netBalance: spentForThem - receivedFromThem
                };
            });

            return NextResponse.json(profilesWithBalance);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
        }
    }

    export async function POST(req: Request) {
        try {
            const body = await req.json();
            const { name, note } = body;

            if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

            const profile = await prisma.profile.create({
                data: { name, note }
            });
            return NextResponse.json(profile);
        } catch (error) {
            return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
        }
    }
