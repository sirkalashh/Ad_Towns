import React, { useEffect, useState } from 'react';
import { AD_SLOTS } from '@/pixels/lib/mockData';
import { Card, CardContent } from '@/pixels/components/ui/card';
import { Button } from '@/pixels/components/ui/button';
import { Badge } from '@/pixels/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/pixels/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const AdSlider = ({ position }) => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // Fetch from mock data based on position
    if (AD_SLOTS[position]) {
      setAds(AD_SLOTS[position]);
    }
  }, [position]);

  const plugin = React.useRef(
    Autoplay({ delay: 3200, stopOnInteraction: true })
  );

  if (ads.length === 0) return null;

  return (
    <div className="my-6" data-testid={`ad-slider-${position}`}>
      {/* Desktop: Full width banner / Carousel if multiple */}
      <div className="hidden md:block px-1">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {ads.map((ad, idx) => (
              <CarouselItem key={idx}>
                <Card 
                  className="border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: ad.background_color || '#3B82F6' }}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex-1 text-white">
                      <Badge variant="outline" className="border-white/30 text-white bg-white/10 mb-2 font-medium tracking-wide uppercase text-[10px]">
                        {ad.label_text || 'Sponsored'}
                      </Badge>
                      <h3 className="text-2xl font-bold mt-1 tracking-tight">{ad.title}</h3>
                      {ad.subtitle && (
                        <p className="text-white/80 text-base mt-1.5 font-medium">{ad.subtitle}</p>
                      )}
                    </div>
                    {ad.cta_text && (
                      <div className="ml-6 pl-6 border-l border-white/20">
                        <Button 
                          className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all rounded-xl"
                        >
                          {ad.cta_text}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {ads.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-white/20 border-0 text-white hover:bg-white hover:text-gray-900" />
              <CarouselNext className="right-4 bg-white/20 border-0 text-white hover:bg-white hover:text-gray-900" />
            </>
          )}
        </Carousel>
      </div>

      {/* Mobile: Card carousel (horizontal scroll) */}
      <div className="md:hidden">
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 px-4">
            {ads.map((ad, idx) => (
              <CarouselItem key={idx} className="pl-2 md:pl-4 basis-[90%]">
                <Card 
                  className="border-0 shadow-md overflow-hidden h-full"
                  style={{ backgroundColor: ad.background_color || '#3B82F6' }}
                >
                  <CardContent className="p-5 flex flex-col h-full text-white">
                    <Badge variant="outline" className="w-max border-white/30 text-white bg-white/10 mb-2 font-medium uppercase text-[10px]">
                      {ad.label_text || 'Sponsored'}
                    </Badge>
                    <h3 className="text-xl font-bold mt-1 leading-tight">{ad.title}</h3>
                    {ad.subtitle && (
                      <p className="text-white/80 text-sm mt-1.5 flex-1">{ad.subtitle}</p>
                    )}
                    {ad.cta_text && (
                      <Button 
                        className="w-full mt-4 bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-md"
                      >
                        {ad.cta_text}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default AdSlider;
