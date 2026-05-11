import React from 'react';
import { ExternalLink, Star, Eye, Phone, Crown } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/pixels/components/ui/dialog';
import { Button } from '@/pixels/components/ui/button';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';
import { toast } from 'sonner';

const DealCardPopup = ({ pixel, vendor, category, onClose }) => {
  if (!vendor) return null;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi, I saw your deal on PixelBazaar: ${vendor.deal_headline}`);
    const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${message}`;
    
    toast.success('Opening WhatsApp...', {
      description: `Connecting you with ${vendor.business_name}`,
    });
    
    // In a real app, track the tap
    // axios.post(`${API}/pixels/${pixel.id}/whatsapp-tap`);
    
    window.open(whatsappUrl, '_blank');
  };

  const isPremium = pixel.pixel_type === 'premium';
  const categoryColor = category?.primary_color || '#3B82F6';

  return (
    <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 shadow-2xl">
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
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mb-2">
              <span className="text-3xl font-bold">{vendor.business_name.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        )}
        
        {isPremium && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg px-2.5 py-1">
              <Crown className="w-3.5 h-3.5 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 pt-5 space-y-4">
        <DialogHeader className="p-0 text-left space-y-3">
          <DialogTitle className="text-2xl font-bold leading-none tracking-tight">
            {vendor.business_name}
          </DialogTitle>
          
          <div
            className="inline-flex w-max px-3 py-1.5 rounded-md text-white font-semibold text-sm shadow-sm"
            style={{ backgroundColor: categoryColor }}
          >
            {vendor.deal_headline}
          </div>
          
          <DialogDescription className="text-base text-gray-600 mt-2">
            {vendor.description}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1 bg-yellow-50 border-yellow-200 text-yellow-700 rounded-full px-2.5 py-0.5">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              {vendor.rating.toFixed(1)}
            </Badge>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{vendor.views_count}</span>
            </div>
          </div>
          
          {vendor.expires_at && (
            <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
              Expires: {new Date(vendor.expires_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md hover:shadow-lg transition-all h-12 text-base"
            onClick={handleWhatsAppClick}
          >
            <Phone className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
          
          {vendor.link_url && (
            <Button 
              variant="outline" 
              className="w-12 h-12 p-0 border-gray-200 hover:bg-gray-50"
              onClick={() => window.open(vendor.link_url, '_blank')}
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
              <span className="sr-only">Visit Website</span>
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default DealCardPopup;
