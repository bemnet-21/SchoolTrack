import AuthGuard from "@/app/components/AuthGuard";
import StoreProvider from "../components/StoreProvider";
import Sidebar from "../components/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthGuard>
          <div className="flex h-screen">
              <Sidebar />
              <main className="w-full overflow-y-auto bg-bgGray md:ml-64">
                <Header />
                {children}
              </main>
          </div>
      </AuthGuard>
    </StoreProvider>
  );
}