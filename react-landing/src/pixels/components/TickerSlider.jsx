import React, { useEffect, useState } from 'react';
import { TICKER_ADS } from '@/pixels/lib/mockData';
import { Badge } from '@/pixels/components/ui/badge';
import { Button } from '@/pixels/components/ui/button';

const TickerSlider = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // In a real app, fetch from API. Using mock data here.
    setAds(TICKER_ADS);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 2600); // 2.6 seconds as per spec

    return () => clearInterval(interval);
  }, [ads]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div
      className="sticky top-0 z-30 h-[40px] flex items-center justify-center px-4 transition-colors duration-500 shadow-sm"
      style={{ backgroundColor: currentAd.background_color || '#3B82F6' }}
      data-testid="ticker-slider"
    >
      <div className="flex items-center gap-3 text-white max-w-5xl w-full justify-center">
        <Badge variant="outline" className="h-5 px-1.5 border-white/30 text-white bg-white/10 hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </Badge>
        
        <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-0 text-sm">
          <span className="font-bold whitespace-nowrap">{currentAd.title}</span>
          
          {currentAd.subtitle && (
            <span className="text-xs opacity-90 hidden sm:inline-block">
              • {currentAd.subtitle}
            </span>
          )}
        </div>
        
        {currentAd.cta_text && (
          <Button 
            variant="link" 
            className="h-auto p-0 text-xs text-white underline hover:text-white/80 font-medium ml-1 whitespace-nowrap"
          >
            {currentAd.cta_text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TickerSlider;
