import React from 'react';
import { ExternalLink, Star, Eye, Phone, Crown } from 'lucide-react';
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/pixels/components/ui/drawer';
import { Button } from '@/pixels/components/ui/button';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';
import { toast } from 'sonner';

const DealBottomDrawer = ({ pixel, vendor, category, onClose }) => {
  if (!vendor) return null;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi, I saw your deal on PixelBazaar: ${vendor.deal_headline}`);
    const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${message}`;
    
    toast.success('Opening WhatsApp...', {
      description: `Connecting you with ${vendor.business_name}`,
    });
    
    // axios.post(`${API}/pixels/${pixel.id}/whatsapp-tap`);
    window.open(whatsappUrl, '_blank');
  };

  const isPremium = pixel.pixel_type === 'premium';
  const categoryColor = category?.primary_color || '#3B82F6';

  return (
    <DrawerContent className="max-h-[90vh]">
      {/* Vendor Image Area */}
      <div className="relative w-full h-48 bg-gray-100">
        {vendor.image_url ? (
          <img
            src={vendor.image_url}
            alt={vendor.business_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center text-white"
            style={{ backgroundColor: vendor.color || '#3B82F6' }}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mb-2 shadow-inner">
              <span className="text-4xl font-bold">{vendor.business_name.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        )}
        
        {isPremium && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-500 text-white border-0 shadow-lg px-2.5 py-1">
              <Crown className="w-3.5 h-3.5 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      <div className="px-4 py-5 overflow-y-auto">
        <DrawerHeader className="p-0 text-left space-y-3">
          <DrawerTitle className="text-2xl font-bold leading-none tracking-tight">
            {vendor.business_name}
          </DrawerTitle>
          
          <div
            className="w-full px-4 py-2.5 rounded-lg text-white font-semibold text-center shadow-sm"
            style={{ backgroundColor: categoryColor }}
          >
            {vendor.deal_headline}
          </div>
          
          <DrawerDescription className="text-base text-gray-600 mt-3 leading-relaxed">
            {vendor.description}
          </DrawerDescription>
        </DrawerHeader>

        <Separator className="my-5" />

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1 bg-yellow-50 border-yellow-200 text-yellow-700 rounded-full px-3 py-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-semibold">{vendor.rating.toFixed(1)}</span>
            </Badge>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Eye className="w-5 h-5" />
              <span className="font-medium text-sm">{vendor.views_count} views</span>
            </div>
          </div>
          
          {vendor.expires_at && (
            <div className="text-xs font-medium text-gray-400">
              Exp: {new Date(vendor.expires_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <DrawerFooter className="pt-2 pb-6 px-4">
        <Button 
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transition-all h-14 text-lg font-bold rounded-xl"
          onClick={handleWhatsAppClick}
        >
          <Phone className="w-6 h-6 mr-2" />
          WhatsApp Connect
        </Button>
        
        {vendor.link_url && (
          <Button 
            variant="outline" 
            className="w-full h-12 mt-2 border-gray-200 text-gray-600 rounded-xl font-semibold"
            onClick={() => window.open(vendor.link_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
        )}
      </DrawerFooter>
    </DrawerContent>
  );
};

export default DealBottomDrawer;
