import SEO from './components/SEO';
import { Routes, Route, useLocation } from 'react-router-dom';
import Ticker from './components/Ticker';
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import PixelsHome from './pixels/pages/PixelsHome';
import PixelsCityPage from './pixels/pages/PixelsCityPage';
import BuyPixels from './pixels/pages/BuyPixels';
import { TooltipProvider } from '@/pixels/components/ui/tooltip';
import { Toaster } from '@/pixels/components/ui/sonner';

function App() {
  const location = useLocation();
  const isPixelsRoute = location.pathname.startsWith('/pixels');

  const routes = isPixelsRoute ? (
    <Routes>
      <Route path="/pixels" element={<PixelsHome />} />
      <Route path="/pixels/buy" element={<BuyPixels />} />
      <Route path="/pixels/city/:citySlug" element={<PixelsCityPage />} />
    </Routes>
  ) : (
    <div className="font-sans antialiased text-gray-900 bg-bg selection:bg-coral/30">
      <SEO />
      <Ticker />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      {routes}
      <Toaster position="bottom-right" richColors />
    </TooltipProvider>
  );
}

export default App;
