import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Zap, Star, Shield, ArrowRight, MessageCircle, 
  Info, MapPin, Crown, X, ShoppingCart, ArrowLeft 
} from 'lucide-react';
import { CATEGORIES, PRICING, CITY, generateCategoryPixels } from '../lib/mockData';
import { Button } from '@/pixels/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/pixels/components/ui/card';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/pixels/components/ui/tooltip';
import { toast } from 'sonner';
import AdPreviewCard from '../components/AdPreviewCard';

export default function BuyPixels() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('plan'); // 'plan' or 'select'
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].slug);
  const [selectedPixel, setSelectedPixel] = useState(null); // { row, col, type, price }

  const currentCategory = useMemo(() => 
    CATEGORIES.find(c => c.slug === selectedCategory), 
    [selectedCategory]
  );

  const gridData = useMemo(() => 
    generateCategoryPixels(selectedCategory), 
    [selectedCategory]
  );

  const getPrice = (type) => {
    return PRICING[type][selectedCategory];
  };

  const handleSelectPlan = (planType) => {
    // If they click a plan, we could pre-filter or just scroll to the grid
    setCurrentStep('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePixelClick = (pixel) => {
    if (pixel.status === 'taken') {
      toast.error("This pixel is already owned by another business.");
      return;
    }

    const price = getPrice(pixel.pixel_type);
    setSelectedPixel({
      id: pixel.id,
      row: pixel.row_number,
      col: pixel.col_number,
      type: pixel.pixel_type,
      price: price
    });
    
    toast.success(`Pixel [Row ${pixel.row_number}, Col ${pixel.col_number}] selected!`, {
      description: `Price: ₹${price}/year`
    });
  };

  const handleConfirmPurchase = () => {
    if (!selectedPixel) return;
    toast.success("Redirecting to Secure Payment...", {
      description: `Booking Pixel at Row ${selectedPixel.row}, Col ${selectedPixel.col} for ₹${selectedPixel.price}`,
      duration: 5000
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden pb-32">
      {/* Background Gold Dust */}
      <div className="absolute inset-0 gold-dust-bg pointer-events-none" />

      <AnimatePresence mode="wait">
        {currentStep === 'plan' ? (
          <motion.div
            key="plan-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pt-20 pb-16 px-4 relative z-10"
          >
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-turmeric/10 border border-turmeric/20 text-turmeric-deep text-sm font-bold mb-6">
                <Crown className="w-4 h-4" />
                Select your category & see available slots
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-navy mb-6 tracking-tight font-heading">
                Launch Your Shop in <span className="text-turmeric">{CITY.name}</span>
              </h1>
              
              {/* Category Selector */}
              <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                      selectedCategory === cat.slug
                        ? 'bg-turmeric text-white shadow-lg shadow-turmeric/20 scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Pricing Cards */}
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 text-left">
                <PricingCard 
                  type="standard" 
                  floor="Floor 3"
                  price={getPrice('standard')} 
                  onSelect={() => handleSelectPlan('standard')}
                  features={[
                    "1×1 Pixel on Floor 3 (Rows 7-10)",
                    "Direct WhatsApp connection",
                    "Business description & details",
                    "1 Active deal/offer",
                    "Basic analytics (Views)",
                    "40 Slots available"
                  ]}
                />
                <PricingCard 
                  type="premium" 
                  floor="Floor 2"
                  price={getPrice('premium')} 
                  onSelect={() => handleSelectPlan('premium')}
                  isPremium
                  features={[
                    "1×1 Pixel on Floor 2 (Rows 4-6)",
                    "High visibility placement",
                    "Verified Badge on card",
                    "Animated border & glow",
                    "Unlimited deal updates",
                    "30 Slots available"
                  ]}
                />
                <PricingCard 
                  type="elite" 
                  floor="Floor 1"
                  price={getPrice('elite')} 
                  onSelect={() => handleSelectPlan('elite')}
                  isElite
                  features={[
                    "1×1 Pixel on Floor 1 (Rows 1-3)",
                    "Maximum visibility (Top of feed)",
                    "Exclusive Royal Badge",
                    "Premium Gold Glow effect",
                    "Advanced Trend Analytics",
                    "30 Exclusive slots"
                  ]}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="select-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="pt-12 pb-16 px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header with Back button */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentStep('plan')}
                  className="flex items-center gap-2 text-gray-500 font-bold hover:text-navy transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Plans
                </button>
                <div className="text-right">
                  <h2 className="text-2xl font-extrabold text-navy font-heading">{currentCategory.name} Grid</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Booking for {CITY.name}</p>
                </div>
              </div>

              {/* Movie Ticket Booking UI */}
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative">
                {/* The "Screen" / Top of Feed */}
                <div className="flex flex-col items-center mb-16">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-turmeric to-transparent opacity-30 blur-sm mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">City Feed Top</div>
                  <div className="w-[80%] h-[40px] border-t-4 border-turmeric/20 rounded-[50%_/_20px_20px_0_0] mt-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-turmeric/5 to-transparent" />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  <LegendItem type="available" label="Available" />
                  <LegendItem type="taken" label="Taken" />
                  <LegendItem type="elite" label="Floor 1 (Elite)" />
                  <LegendItem type="premium" label="Floor 2 (Premium)" />
                  <LegendItem type="selected" label="Selected" />
                </div>

                {/* Booking Grid */}
                <div className="grid grid-cols-10 gap-2 md:gap-3 max-w-2xl mx-auto">
                  {gridData.pixels.map((p) => (
                    <PixelSeat 
                      key={p.pixel.id} 
                      pixel={p.pixel}
                      vendor={p.vendor}
                      category={currentCategory}
                      isSelected={selectedPixel?.id === p.pixel.id}
                      onClick={() => handlePixelClick(p.pixel)}
                    />
                  ))}
                </div>

                {/* Helpful Tip */}
                <div className="mt-12 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 leading-relaxed">
                    <p className="font-bold mb-1">Floor-Wise Visibility:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Floor 1:</strong> Rows 1-3 (30 Slots)</li>
                      <li><strong>Floor 2:</strong> Rows 4-6 (30 Slots)</li>
                      <li><strong>Floor 3:</strong> Rows 7-10 (40 Slots)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Booking Bar (Only in 'select' step) */}
      <AnimatePresence>
        {currentStep === 'select' && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-4xl mx-auto bg-navy text-white rounded-[2rem] p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                {selectedPixel ? (
                  <div className="w-12 h-12 rounded-xl bg-turmeric flex items-center justify-center animate-pulse">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white/50" />
                  </div>
                )}
                <div>
                  <div className="text-lg font-bold">
                    {selectedPixel ? `Floor ${selectedPixel.row}, Col ${selectedPixel.col}` : 'Select a pixel seat'}
                  </div>
                  <div className="text-xs text-white/50 font-bold uppercase tracking-wider">
                    {selectedPixel ? `${selectedPixel.type.toUpperCase()} PIXEL` : 'Tap on any available slot above'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {selectedPixel && (
                  <div className="text-right">
                    <div className="text-2xl font-black text-turmeric">₹{selectedPixel.price}</div>
                    <div className="text-[10px] text-white/50 font-bold">PER YEAR</div>
                  </div>
                )}
                <Button 
                  disabled={!selectedPixel}
                  onClick={handleConfirmPurchase}
                  className="bg-turmeric hover:bg-turmeric-light text-white font-black px-10 py-6 rounded-2xl shadow-lg shadow-turmeric/20 transition-all disabled:opacity-30"
                >
                  Confirm & Pay ↗
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PricingCard({ type, floor, price, onSelect, features, isPremium, isElite }) {
  const getHeaderStyles = () => {
    if (isElite) return 'bg-purple-600/10 text-purple-600 border-purple-200';
    if (isPremium) return 'bg-turmeric/10 text-turmeric border-turmeric/20';
    return 'bg-gray-100 text-gray-400 border-gray-100';
  };

  const getBorderStyles = () => {
    if (isElite) return 'border-2 border-purple-500 shadow-purple-500/10';
    if (isPremium) return 'border-2 border-turmeric shadow-turmeric/10';
    return 'border-gray-100';
  };

  const getPriceColor = () => {
    if (isElite) return 'text-purple-600';
    if (isPremium) return 'text-turmeric';
    return 'text-navy';
  };

  return (
    <Card className={`relative overflow-hidden border-0 shadow-2xl transition-all hover:scale-[1.02] flex flex-col ${getBorderStyles()}`}>
      <div className={`absolute top-0 left-0 w-full h-2 ${isElite ? 'bg-purple-600' : isPremium ? 'bg-turmeric' : 'bg-gray-200'}`} />
      <CardHeader className="pt-10 pb-6 text-center">
        <Badge variant="outline" className={`w-fit mx-auto mb-4 font-black uppercase tracking-widest text-[10px] ${getHeaderStyles()}`}>
          {floor}
        </Badge>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getHeaderStyles()}`}>
          {isElite ? <Crown className="w-8 h-8" /> : isPremium ? <Star className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
        </div>
        <h3 className="text-2xl font-bold text-navy capitalize">{type} Pixel</h3>
        <p className="text-gray-500 text-sm">{isElite ? 'Royal floor visibility' : isPremium ? 'Premium placement' : 'Essential local visibility'}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-center mb-8">
          <span className={`text-4xl font-black ${getPriceColor()}`}>₹{price}</span>
          <span className="text-gray-400 font-bold ml-1">/year</span>
        </div>
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`mt-1 rounded-full p-0.5 ${isElite ? 'bg-purple-600 text-white' : isPremium ? 'bg-turmeric text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={`text-sm ${isElite || isPremium ? 'text-navy font-bold' : 'text-gray-600'}`}>{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-8 pt-6">
        <Button 
          variant={(isPremium || isElite) ? 'default' : 'outline'}
          className={`w-full py-7 rounded-2xl text-lg font-bold border-2 ${isElite ? 'bg-purple-600 hover:bg-purple-700 text-white border-0' : isPremium ? 'turmeric-glow-button border-0' : 'hover:bg-gray-50'}`}
          onClick={onSelect}
        >
          Select {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </CardFooter>
    </Card>
  );
}

function LegendItem({ type, label }) {
  const getStyles = () => {
    switch (type) {
      case 'available': return 'bg-white border-2 border-gray-200';
      case 'taken': return 'bg-gray-100 border-2 border-gray-100 text-gray-400';
      case 'elite': return 'bg-purple-50 border-2 border-purple-300';
      case 'premium': return 'bg-amber-50 border-2 border-amber-300';
      case 'selected': return 'bg-turmeric border-2 border-turmeric-deep text-white';
      default: return '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-6 rounded-md flex items-center justify-center ${getStyles()}`}>
        {type === 'taken' && <X className="w-3 h-3" />}
        {type === 'selected' && <Check className="w-3 h-3" />}
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</span>
    </div>
  );
}

function PixelSeat({ pixel, vendor, category, isSelected, onClick }) {
  const isElite = pixel.pixel_type === 'elite';
  const isPremium = pixel.pixel_type === 'premium';
  const isTaken = pixel.status === 'taken';

  const baseStyles = "relative w-full aspect-[0.7] rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer";
  
  let stateStyles = "";
  if (isSelected) {
    stateStyles = "bg-turmeric border-2 border-turmeric-deep text-white shadow-[0_0_15px_rgba(226,166,45,0.5)] scale-110 z-10";
  } else if (isTaken) {
    stateStyles = "bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-60";
  } else if (isElite) {
    stateStyles = "bg-purple-50 border-2 border-purple-300 text-purple-500 hover:bg-purple-100 hover:scale-105 shadow-[0_0_10px_rgba(147,51,234,0.1)]";
  } else if (isPremium) {
    stateStyles = "bg-amber-50 border-2 border-amber-300 text-amber-500 hover:bg-amber-100 hover:scale-105";
  } else {
    stateStyles = "bg-white border-2 border-gray-200 text-gray-300 hover:border-turmeric/50 hover:scale-105";
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`${baseStyles} ${stateStyles}`}
          onClick={onClick}
        >
          {isSelected ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : isTaken ? (
            <X className="w-3 h-3" />
          ) : isElite ? (
            <Crown className="w-3 h-3" />
          ) : isPremium ? (
            <Star className="w-3 h-3" />
          ) : null}
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="p-0 border-0 bg-transparent shadow-none" 
        sideOffset={15}
        align="start"
      >
        <AdPreviewCard 
          vendor={vendor} 
          pixel={pixel} 
          category={category} 
        />
      </TooltipContent>
    </Tooltip>
  );
}
