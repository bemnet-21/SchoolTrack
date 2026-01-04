import AuthGuard from "@/app/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
        <div className="dashboard-container">
            {children}
        </div>
    </AuthGuard>
  );
}