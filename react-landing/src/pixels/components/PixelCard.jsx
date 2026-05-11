import React from 'react';
import { Crown } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/pixels/components/ui/tooltip';
import { Badge } from '@/pixels/components/ui/badge';
import AdPreviewCard from './AdPreviewCard';

const PixelCard = ({ pixelData, onPixelClick }) => {
  const { pixel, vendor } = pixelData;
  const isPremium = pixel.pixel_type === 'premium';
  const isAvailable = pixel.status === 'available';
  const isTaken = pixel.status === 'taken' && vendor;

  const getStatusBadge = () => {
    if (!vendor) return null;
    
    const createdDaysAgo = Math.floor(
      (new Date() - new Date(vendor.created_at)) / (1000 * 60 * 60 * 24)
    );
    
    const expiresInDays = Math.floor(
      (new Date(vendor.expires_at) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (createdDaysAgo < 14) {
      return (
        <Badge variant="default" className="absolute top-1 left-1 w-2.5 h-2.5 p-0 bg-green-500 rounded-full border-2 border-white shadow-sm" title="New" />
      );
    } else if (expiresInDays < 7) {
      return (
        <Badge variant="destructive" className="absolute top-1 left-1 w-2.5 h-2.5 p-0 bg-orange-500 rounded-full border-2 border-white shadow-sm" title="Expiring Soon" />
      );
    }
    return null;
  };

  const pixelContent = (
    <div
      onClick={() => isTaken && onPixelClick(pixel, vendor)}
      className={`
        relative overflow-hidden rounded-md w-full h-full
        ${isPremium ? 'border-2 border-amber-400 shadow-sm' : 'border border-gray-300'}
        ${isTaken ? 'cursor-pointer pixel-hover' : ''}
        ${isAvailable ? 'bg-gray-100 border-dashed' : ''}
      `}
      style={{
        aspectRatio: '0.55',
        backgroundColor: isAvailable
          ? (isPremium ? '#FEF3C7' : '#F9FAFB')
          : '#FFFFFF',
      }}
      data-testid={`pixel-${pixel.row_number}-${pixel.col_number}`}
    >
      {isPremium && isTaken && (
        <Crown className="absolute top-1 right-1 w-3 h-3 text-amber-500 z-10 filter drop-shadow-sm" />
      )}
      
      {getStatusBadge()}

      {isTaken && vendor ? (
        <div className="w-full h-full relative group">
          {vendor.image_url ? (
            <img
              src={vendor.image_url}
              alt={vendor.business_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-lg md:text-sm shadow-inner transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: vendor.color || '#3B82F6' }}
            >
              {vendor.business_name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 group hover:bg-gray-200 transition-colors">
          {isPremium ? (
            <Crown className="w-5 h-5 text-amber-300 group-hover:text-amber-400 transition-colors" />
          ) : (
            <span className="text-xl font-light group-hover:text-gray-500 transition-colors">+</span>
          )}
        </div>
      )}
    </div>
  );

  // Wrap taken pixels with tooltip for desktop
  if (isTaken && vendor) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {pixelContent}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="p-0 border-0 bg-transparent shadow-none" 
          sideOffset={20}
          align="start"
        >
          <AdPreviewCard vendor={vendor} pixel={pixel} />
        </TooltipContent>
      </Tooltip>
    );
  }

  return pixelContent;
};

export default PixelCard;
