import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await logout();
    return NextResponse.json({ success: true });
}
