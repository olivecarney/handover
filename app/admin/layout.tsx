import AdminSidebar from "./AdminSidebar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const useClerk = process.env.AUTH_PROVIDER === 'clerk';

  if (useClerk) {
    return (
      <ClerkProvider>
        <AdminSidebar useClerk={true}>
          {children}
        </AdminSidebar>
      </ClerkProvider>
    );
  }

  return (
    <AdminSidebar useClerk={false}>
      {children}
    </AdminSidebar>
  );
}
