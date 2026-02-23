import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CustomerLoginForm } from '@/components/auth/CustomerLoginForm';

export default function CustomerLoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <CustomerLoginForm />
      </main>
      <Footer />
    </div>
  );
}
