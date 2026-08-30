import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileStickyBar from '@/components/MobileStickyBar';
import AIChatWidget from '@/components/AIChatWidget';
import NotificationBar from '@/components/NotificationBar';
import { Toaster } from 'sonner';

export default function SiteLayout({ children }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <NotificationBar />
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
      <AIChatWidget />
    </>
  );
}
