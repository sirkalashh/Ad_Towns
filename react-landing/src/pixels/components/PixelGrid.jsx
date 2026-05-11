import React, { useState, useEffect } from 'react';
import { Crown, Star, Eye, ExternalLink } from 'lucide-react';
import PixelCard from './PixelCard';
import DealCardPopup from './DealCardPopup';
import DealBottomDrawer from './DealBottomDrawer';
import AdSlider from './AdSlider';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';
import { Dialog } from '@/pixels/components/ui/dialog';
import { Drawer } from '@/pixels/components/ui/drawer';
import { Skeleton } from '@/pixels/components/ui/skeleton';

const PixelGrid = ({ gridData, categorySlug }) => {
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePixelClick = (pixel, vendor) => {
    setSelectedPixel(pixel);
    setSelectedVendor(vendor);
    setSelectedCategory(gridData.category);
    setIsPopupOpen(true);
    
    // In a real app, we'd fire an analytics call here
    // axios.get(`${API}/pixels/${pixel.id}`);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => {
      setSelectedPixel(null);
      setSelectedVendor(null);
      setSelectedCategory(null);
    }, 200); // Wait for animation
  };

  if (!gridData) {
    return (
      <div className="w-full space-y-4">
        {/* Loading Skeletons */}
        <div className="grid gap-[3px] md:gap-1 grid-cols-5 md:grid-cols-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <Skeleton key={`sk-${i}`} className="w-full aspect-[0.55]" />
          ))}
        </div>
      </div>
    );
  }

  const { pixels, category } = gridData;

  // Group pixels by row for rendering with ad sliders
  const pixelsByRow = {};
  pixels.forEach((p) => {
    const row = p.pixel.row_number;
    if (!pixelsByRow[row]) pixelsByRow[row] = [];
    pixelsByRow[row].push(p);
  });

  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="w-full" data-testid="pixel-grid">
      <div className="space-y-1">
        {rows.map((rowNum) => (
          <React.Fragment key={rowNum}>
            {/* Elite floor indicator */}
            {rowNum === 1 && (
              <Badge variant="outline" className="mb-2 bg-gradient-to-r from-purple-100 to-purple-50 border-purple-300 text-purple-800 rounded-md px-3 py-1.5 shadow-sm premium-glow">
                <Crown className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                Floor 1 (Elite Visibility)
              </Badge>
            )}

            {/* Premium floor indicator */}
            {rowNum === 4 && (
              <div className="flex items-center gap-4 mt-6 mb-3">
                <Separator className="flex-1 bg-amber-100" />
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 font-bold px-3 py-1 rounded-md uppercase tracking-wider text-[10px]">
                  <Star className="w-3 h-3 mr-1.5" />
                  Floor 2 (Premium)
                </Badge>
                <Separator className="flex-1 bg-amber-100" />
              </div>
            )}
            
            {/* Standard floor indicator */}
            {rowNum === 7 && (
              <div className="flex items-center gap-4 mt-6 mb-3">
                <Separator className="flex-1 bg-gray-200" />
                <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-medium px-3 uppercase tracking-wider text-[10px]">
                  Floor 3 (Standard)
                </Badge>
                <Separator className="flex-1 bg-gray-200" />
              </div>
            )}

            {/* Row of pixels */}
            <div
              className="grid gap-[3px] md:gap-1"
              style={{
                gridTemplateColumns: isMobile ? 'repeat(5, 1fr)' : 'repeat(10, 1fr)',
              }}
            >
              {pixelsByRow[rowNum]?.map((pixelData) => (
                <PixelCard
                  key={pixelData.pixel.id}
                  pixelData={pixelData}
                  onPixelClick={handlePixelClick}
                />
              ))}
            </div>

            {/* Ad sliders after specific rows */}
            {rowNum === 5 && <AdSlider position="after_row_5" />}
            {rowNum === 10 && <AdSlider position="after_row_10" />}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop Deal Popup */}
      {!isMobile && (
        <Dialog open={isPopupOpen} onOpenChange={(open) => !open && closePopup()}>
          <DealCardPopup
            pixel={selectedPixel}
            vendor={selectedVendor}
            category={selectedCategory}
            onClose={closePopup}
          />
        </Dialog>
      )}

      {/* Mobile Deal Drawer */}
      {isMobile && (
        <Drawer open={isPopupOpen} onOpenChange={(open) => !open && closePopup()}>
          <DealBottomDrawer
            pixel={selectedPixel}
            vendor={selectedVendor}
            category={selectedCategory}
            onClose={closePopup}
          />
        </Drawer>
      )}
    </div>
  );
};

export default PixelGrid;
