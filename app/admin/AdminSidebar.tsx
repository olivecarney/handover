"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { UserButton } from "@clerk/nextjs";

export default function AdminSidebar({
    children,
    useClerk,
}: {
    children: React.ReactNode;
    useClerk: boolean;
}) {
    const pathname = usePathname();
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return (
            <div className="min-h-screen bg-background">
                {children}
                <Toaster />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-14 items-center border-b px-6 font-bold text-lg">
                    Handover
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                            pathname === "/admin"
                                ? "bg-muted text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
                    >
                        <Monitor className="h-4 w-4" />
                        View Site
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-muted-foreground">Theme</span>
                        <div className="flex gap-1 bg-muted rounded-md p-1">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn(
                                    "p-1 rounded-sm transition-colors",
                                    mounted && theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                <Sun className="h-3 w-3" />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={cn(
                                    "p-1 rounded-sm transition-colors",
                                    mounted && theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                <Moon className="h-3 w-3" />
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={cn(
                                    "p-1 rounded-sm transition-colors",
                                    mounted && theme === "system" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                <Monitor className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    {useClerk ? (
                        <div className="flex items-center gap-3 px-3 py-2">
                            <UserButton afterSignOutUrl="/" />
                            <span className="text-sm font-medium">Account</span>
                        </div>
                    ) : (
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 sm:ml-64">
                <div className="p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
