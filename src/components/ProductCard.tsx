import { useState } from 'react';
import { 
  Heart, Star, MapPin, Phone, MessageCircle, Volume2, VolumeX,
  Shield, AlertTriangle, Calendar, TrendingUp, Share2, Eye, Bookmark
} from 'lucide-react';
import { Listing } from '../types';
import { formatPrice, formatDistance, formatRating, NumeralSystem } from '../utils/formatters';

interface ProductCardProps {
  item: Listing;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onMakeOffer: (item: Listing) => void;
  onSpeak: (item: Listing) => void;
  isSpeaking: boolean;
  t: (key: string) => string;
  numeralSystem: NumeralSystem;
}

export const ProductCard = ({ 
  item, 
  favorites, 
  onToggleFavorite, 
  onMakeOffer, 
  onSpeak, 
  isSpeaking,
  t,
  numeralSystem 
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this ${item.title} for ${formatPrice(item.price, numeralSystem)} on LocalLink!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl">{item.image}</span>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isFeatured && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              ⭐ {t('featured_seller')}
            </div>
          )}
          {item.isNew && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🆕 {t('new_listing')}
            </div>
          )}
          {item.seasonal && item.seasonTag && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Calendar className="w-3 h-3" />
              {t('fresh')} • {t(item.seasonTag)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={() => onSpeak(item)}
            className={`bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform ${
              isSpeaking ? 'bg-blue-50 ring-2 ring-blue-400' : ''
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-blue-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Heart 
              className={`w-4 h-4 ${
                favorites.includes(item.id) 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-400'
              }`} 
            />
          </button>

          <button
            onClick={handleShare}
            className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          {item.views && (
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatRating(item.views, numeralSystem)}
            </div>
          )}
          {item.saves && (
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              {formatRating(item.saves, numeralSystem)}
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg flex-1 leading-tight">{item.title}</h3>
          {item.isVerified && (
            <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
              <Shield className="w-4 h-4" />
              {t('verified')}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <div className="text-green-600 font-bold text-2xl">
              {formatPrice(item.price, numeralSystem)}
            </div>
            <div className="text-sm text-gray-500">/ {t(item.unit)}</div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {formatRating(item.rating, numeralSystem)}
            </span>
          </div>
        </div>
        
        {/* Location and Time */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
            <span className="text-gray-400">•</span>
            <span>{formatDistance(item.distance, numeralSystem)}</span>
          </div>
          <div className="text-gray-500">{item.lastSeen}</div>
        </div>
        
        {/* Unit Options */}
        {item.unitOptions && item.unitOptions.length > 1 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {item.unitOptions.map(unit => (
              <button
                key={unit}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors"
              >
                {t(unit.replace(' ', '_'))}
              </button>
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button 
            onClick={() => onMakeOffer(item)}
            className="col-span-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <TrendingUp className="w-4 h-4" />
            {t('makeOffer')}
          </button>
          
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        <button className="w-full py-2.5 border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Phone className="w-4 h-4" />
          {t('callSeller')}
        </button>
        
        {/* Safety Actions */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
          <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
            <AlertTriangle className="w-3 h-3" />
            {t('report')}
          </button>
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700">
            <Shield className="w-3 h-3" />
            {t('block')}
          </button>
        </div>
      </div>
    </div>
  );
};