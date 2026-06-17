import DashboardClient from "@/components/dashboard/DashboardClient";
import PageContainer from "@/components/layout/PageContainer";

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-8">
      <DashboardClient />
    </PageContainer>
  );
}