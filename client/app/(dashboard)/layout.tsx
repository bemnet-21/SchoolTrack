import AuthGuard from "@/app/components/AuthGuard";
import StoreProvider from "../components/StoreProvider";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthGuard>
          <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <main className="flex ml-64 p-8 overflow-y-auto">
                {children}
              </main>
          </div>
      </AuthGuard>
    </StoreProvider>
  );
}