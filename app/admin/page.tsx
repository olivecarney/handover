import { getContent } from "@/lib/content";
import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const requireAuth = process.env.REQUIRE_AUTH === 'true';

    if (requireAuth) {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('auth');
        if (authCookie?.value !== process.env.ADMIN_PASSWORD) {
            redirect('/admin/login');
        }
    }

    const content = await getContent();

    return <DashboardClient initialContent={content} />;
}
