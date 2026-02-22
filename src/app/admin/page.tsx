import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming service requests.</p>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
            <Link href="/admin/revenue">
              <LineChart className="mr-2 h-5 w-5" />
              View Revenue
            </Link>
          </Button>
        </div>
        <div className="space-y-8">
          <DashboardClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
