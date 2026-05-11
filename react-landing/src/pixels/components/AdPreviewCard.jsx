import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Star, Crown, ExternalLink, Zap } from 'lucide-react';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';

const AdPreviewCard = ({ vendor, category, pixel }) => {
  if (!vendor) {
    // If no vendor, show a "Your Ad Here" demo
    return (
      <div className="w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <Badge className="bg-turmeric text-white">Preview Mode</Badge>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {pixel ? `Floor ${pixel.row_number}, Col ${pixel.col_number}` : 'Sample Slot'}
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
            <Zap className="w-8 h-8 text-gray-300" />
          </div>
          <h4 className="text-xl font-bold text-navy mb-2">Your Business Here</h4>
          <p className="text-sm text-gray-500 mb-4 italic">"This is how your amazing offer will look to thousands of daily visitors!"</p>
          <Separator className="my-4" />
          <div className="flex items-center justify-center gap-2 text-turmeric font-bold text-sm">
            <MessageCircle className="w-4 h-4" />
            Direct WhatsApp Connect
          </div>
        </div>
      </div>
    );
  }

  const isElite = pixel?.pixel_type === 'elite';
  const isPremium = pixel?.pixel_type === 'premium';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-[300px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Top Banner */}
      <div 
        className="h-24 relative overflow-hidden flex items-end p-4"
        style={{ backgroundColor: vendor.color || '#3B82F6' }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-4 right-4 flex gap-2">
          {isElite && (
            <Badge className="bg-purple-600 text-white border-0 shadow-lg animate-pulse">
              <Crown className="w-3 h-3 mr-1" /> Elite
            </Badge>
          )}
          {isPremium && !isElite && (
            <Badge className="bg-amber-400 text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" /> Premium
            </Badge>
          )}
        </div>
        <div className="relative z-10 w-full flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-xl font-black" style={{ color: vendor.color }}>
            {vendor.business_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-black truncate leading-none mb-1 drop-shadow-sm">{vendor.business_name}</h4>
            <div className="flex items-center gap-1 text-[10px] text-white/80 font-bold uppercase tracking-wider">
              <MapPin className="w-2.5 h-2.5" /> {category?.name || 'Local'} Vendor
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <div className="inline-block px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-black uppercase mb-2">
            Special Offer
          </div>
          <h5 className="text-lg font-extrabold text-navy leading-tight mb-2">
            {vendor.deal_headline}
          </h5>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {vendor.description}
          </p>
        </div>

        <Separator />

        {/* Action Preview */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase">Live Preview</span>
            <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
              <MessageCircle className="w-4 h-4 fill-green-600/10" />
              WhatsApp Open
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom Visual Ticker */}
      <div className="bg-gray-50 px-5 py-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live Ad Active</span>
        </div>
        <div className="text-[10px] font-black text-navy/30 italic uppercase">
          AdTowns Indore
        </div>
      </div>
    </motion.div>
  );
};

export default AdPreviewCard;
