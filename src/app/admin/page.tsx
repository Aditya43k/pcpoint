import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { mockServiceRequests } from "@/lib/data";

export default function AdminPage() {
  // In a real app, you would fetch this data from your database.
  const requests = mockServiceRequests;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage service requests and technician assignments.</p>
        </div>
        <DashboardClient initialRequests={requests} />
      </main>
      <Footer />
    </div>
  );
}
