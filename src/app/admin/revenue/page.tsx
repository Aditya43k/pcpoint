import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { RevenueWidget } from "@/components/admin/RevenueWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RevenuePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Revenue Overview</h1>
                <p className="text-muted-foreground">Track your total revenue from completed services.</p>
            </div>
            <Button asChild variant="outline">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
        <RevenueWidget />
      </main>
      <Footer />
    </div>
  );
}
