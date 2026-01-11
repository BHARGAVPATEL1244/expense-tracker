import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({
            status: "ok",
            message: "Database connection successful",
            env: {
                // Return masked URL to verify structure without leaking full password
                database_url: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ":***@") : "MISSING",
                node_env: process.env.NODE_ENV
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: "Database connection failed",
            details: String(error),
            env: {
                database_url: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ":***@") : "MISSING"
            }
        }, { status: 500 });
    }
}
