import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ServiceRequestForm } from '@/components/request/ServiceRequestForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RequestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-headline">Submit a Service Request</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Please provide as much detail as possible so we can help you faster.
              </CardDescription>
            </CardHeader>
            <ServiceRequestForm />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
