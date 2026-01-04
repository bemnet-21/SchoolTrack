import AuthGuard from "@/app/components/AuthGuard";
import StoreProvider from "../components/StoreProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthGuard>
          <div className="dashboard-container">
              {children}
          </div>
      </AuthGuard>
    </StoreProvider>
  );
}