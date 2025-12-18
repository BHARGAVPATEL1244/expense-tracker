
// This file is used to replace the page.tsx root to redirect to dashboard
import { redirect } from "next/navigation";

export default function Home() {
    redirect("/dashboard");
}
