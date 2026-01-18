import { useState, useEffect, type ChangeEvent } from 'react';
import { 
  User, Plus, Search, Heart, MessageCircle, Star, MapPin, Phone,
  Camera, Filter, Grid, List, Globe, Bell, Settings, ChevronRight,
  ChevronLeft, Home, Package, UserCircle, Mic, MicOff, Volume2,
  VolumeX, Shield, AlertTriangle, Calendar, TrendingUp, TrendingDown,
  Send
} from 'lucide-react';

// Types
interface Listing {
  id: number;
  title: string;
  price: number;
  location: string;
  seller: string;
  category: string;
  image: string;
  rating: number;
  isFeatured: boolean;
  isNew: boolean;
  isVerified: boolean;
  seasonal: boolean;
  unit: string;
  unitOptions: string[];
  description: string;
  seasonTag: string | null;
  distance: number;
  lastSeen: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [language, setLanguage] = useState('en');
  const [numeralSystem, setNumeralSystem] = useState('western');
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filterModal, setFilterModal] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [distanceRange, setDistanceRange] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [seasonalOnly, setSeasonalOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Translation system
  const translations: any = {
    en: {
      appName: 'LocalLink',
      home: 'Home',
      sell: 'Sell',
      messages: 'Messages',
      profile: 'Profile',
      search: 'Search products...',
      categories: 'Categories',
      nearYou: 'Near You',
      featured: 'Featured',
      viewAll: 'View All',
      addListing: 'Add New Listing',
      login: 'Login',
      signup: 'Sign Up',
      favorites: 'Favorites',
      settings: 'Settings',
      notifications: 'Notifications',
      price: 'Price',
      location: 'Location',
      contact: 'Contact',
      description: 'Description',
      allCategories: 'All',
      crafts: 'Crafts',
      food: 'Food',
      textiles: 'Textiles',
      farming: 'Farming',
      featured_seller: 'Featured Seller',
      new_listing: 'New',
      premium: 'Premium',
      voiceSearch: 'Voice Search',
      makeOffer: 'Make Offer',
      counterOffer: 'Counter Offer',
      acceptOffer: 'Accept',
      filters: 'Filters',
      distance: 'Distance',
      report: 'Report',
      block: 'Block',
      verified: 'Verified',
      seasonal: 'Seasonal',
      fresh: 'Fresh',
      monsoon: 'Monsoon',
      winter: 'Winter',
      harvest: 'Harvest',
      currency: 'PKR',
      kg: 'kg',
      seer: 'seer',
      maund: 'maund',
      bag5kg: '5kg bag',
      bag10kg: '10kg bag',
      speakListing: 'Speak listing details',
      stopSpeaking: 'Stop speaking'
    },
    ur: {
      appName: 'لوکل لنک',
      home: 'ہوم',
      sell: 'بیچیں',
      messages: 'پیغامات',
      profile: 'پروفائل',
      search: 'مصنوعات تلاش کریں...',
      categories: 'اقسام',
      nearYou: 'آپ کے قریب',
      featured: 'خصوصی',
      viewAll: 'سب دیکھیں',
      addListing: 'نئی لسٹنگ شامل کریں',
      login: 'لاگ ان',
      signup: 'سائن اپ',
      favorites: 'پسندیدہ',
      settings: 'ترتیبات',
      notifications: 'اطلاعات',
      price: 'قیمت',
      location: 'مقام',
      contact: 'رابطہ',
      description: 'تفصیل',
      allCategories: 'تمام',
      crafts: 'دستکاری',
      food: 'کھانا',
      textiles: 'کپڑے',
      farming: 'کاشتکاری',
      featured_seller: 'نمایاں بیچنے والا',
      new_listing: 'نیا',
      premium: 'پریمیم',
      voiceSearch: 'آواز سے تلاش',
      makeOffer: 'پیشکش',
      counterOffer: 'جوابی پیشکش',
      acceptOffer: 'منظور',
      filters: 'فلٹرز',
      distance: 'فاصلہ',
      report: 'شکایت',
      block: 'بلاک',
      verified: 'تصدیق شدہ',
      seasonal: 'موسمی',
      fresh: 'تازہ',
      monsoon: 'برسات',
      winter: 'سردی',
      harvest: 'فصل',
      currency: 'PKR',
      kg: 'کلو',
      seer: 'سیر',
      maund: 'من',
      bag5kg: '۵ کلو بیگ',
      bag10kg: '۱۰ کلو بیگ',
      speakListing: 'لسٹنگ پڑھیں',
      stopSpeaking: 'رک جائیں'
    },
    hi: {
      appName: 'लोकल लिंक',
      home: 'होम',
      sell: 'बेचें',
      messages: 'संदेश',
      profile: 'प्रोफ़ाइल',
      search: 'उत्पाद खोजें...',
      categories: 'श्रेणियां',
      nearYou: 'आपके पास',
      featured: 'विशेष',
      viewAll: 'सभी देखें',
      addListing: 'नई लिस्टिंग जोड़ें',
      login: 'लॉगिन',
      signup: 'साइन अप',
      favorites: 'पसंदीदा',
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
      price: 'मूल्य',
      location: 'स्थान',
      contact: 'संपर्क',
      description: 'विवरण',
      allCategories: 'सभी',
      crafts: 'शिल्प',
      food: 'भोजन',
      textiles: 'वस्त्र',
      farming: 'खेती',
      featured_seller: 'विशेष विक्रेता',
      new_listing: 'नया',
      premium: 'प्रीमियम',
      voiceSearch: 'आवाज़ से खोजें',
      makeOffer: 'ऑफर करें',
      counterOffer: 'काउंटर ऑफर',
      acceptOffer: 'स्वीकार',
      filters: 'फ़िल्टर',
      distance: 'दूरी',
      report: 'रिपोर्ट',
      block: 'ब्लॉक',
      verified: 'सत्यापित',
      seasonal: 'मौसमी',
      fresh: 'ताज़ा',
      monsoon: 'मानसून',
      winter: 'सर्दी',
      harvest: 'फसल',
      currency: 'PKR',
      kg: 'किलो',
      seer: 'सेर',
      maund: 'मन',
      bag5kg: '5 किलो बैग',
      bag10kg: '10 किलो बैग',
      speakListing: 'लिस्टिंग सुनें',
      stopSpeaking: 'रोकें'
    }
  };

  const t = (key: string) => translations[language][key] || key;

  // Number formatting
  const formatNumber = (num: number) => {
    const str = num.toString();
    if (numeralSystem === 'urdu' && language === 'ur') {
      return str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
    }
    if (numeralSystem === 'devanagari' && language === 'hi') {
      return str.replace(/[0-9]/g, (d) => '०१२३४५६७८९'[parseInt(d)]);
    }
    return str;
  };

  const formatPrice = (price: number) => `₨${formatNumber(price)}`;

  // Initialize mock data
  useEffect(() => {
    setListings([
      {
        id: 1,
        title: 'Handwoven Carpet',
        price: 2500,
        location: 'Peshawar',
        seller: 'Ahmad Khan',
        category: 'textiles',
        image: '🧶',
        rating: 4.8,
        isFeatured: true,
        isNew: false,
        isVerified: true,
        seasonal: false,
        unit: 'piece',
        unitOptions: ['piece'],
        description: 'Beautiful traditional handwoven carpet made with pure wool.',
        seasonTag: null,
        distance: 5.2,
        lastSeen: '2 hours ago'
      },
      {
        id: 2,
        title: 'Organic Mangoes',
        price: 150,
        location: 'Multan',
        seller: 'Fatima Bibi',
        category: 'food',
        image: '🥭',
        rating: 4.9,
        isFeatured: false,
        isNew: true,
        isVerified: true,
        seasonal: true,
        unit: 'kg',
        unitOptions: ['kg', 'seer', 'bag5kg'],
        description: 'Fresh organic mangoes directly from farm.',
        seasonTag: 'monsoon',
        distance: 12.8,
        lastSeen: '1 hour ago'
      },
      {
        id: 3,
        title: 'Clay Pottery Set',
        price: 800,
        location: 'Hala',
        seller: 'Ustad Ali',
        category: 'crafts',
        image: '🏺',
        rating: 4.7,
        isFeatured: true,
        isNew: false,
        isVerified: false,
        seasonal: false,
        unit: 'set',
        unitOptions: ['set', 'piece'],
        description: 'Traditional clay pottery set, handmade with care.',
        seasonTag: null,
        distance: 8.5,
        lastSeen: '4 hours ago'
      },
      {
        id: 4,
        title: 'Wheat Flour',
        price: 80,
        location: 'Faisalabad',
        seller: 'Mohammad Iqbal',
        category: 'farming',
        image: '🌾',
        rating: 4.6,
        isFeatured: false,
        isNew: true,
        isVerified: true,
        seasonal: true,
        unit: 'kg',
        unitOptions: ['kg', 'seer', 'maund', 'bag5kg', 'bag10kg'],
        description: 'Fresh wheat flour, stone ground, 10kg bag.',
        seasonTag: 'harvest',
        distance: 15.3,
        lastSeen: '30 minutes ago'
      }
    ]);

    setNotifications([
      { id: 1, message: 'New order received for Clay Pottery', time: '2 hours ago' },
      { id: 2, message: 'Ahmad Khan sent you a message', time: '5 hours ago' },
      { id: 3, message: 'Price drop alert: Handwoven Carpet', time: '1 day ago' }
    ]);
  }, []);

  // Voice functionality
  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('organic mangoes');
      setIsListening(false);
    }, 2000);
  };

  const speakListing = (listing: Listing) => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  const categories: Category[] = [
    { id: 'all', name: t('allCategories'), icon: '📦' },
    { id: 'crafts', name: t('crafts'), icon: '🎨' },
    { id: 'food', name: t('food'), icon: '🍎' },
    { id: 'textiles', name: t('textiles'), icon: '🧵' },
    { id: 'farming', name: t('farming'), icon: '🌾' }
  ];

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesDistance = item.distance <= distanceRange;
    const matchesRating = item.rating >= minRating;
    const matchesVerified = !verifiedOnly || item.isVerified;
    const matchesNew = !newOnly || item.isNew;
    const matchesSeasonal = !seasonalOnly || item.seasonal;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesDistance &&
      matchesRating &&
      matchesVerified &&
      matchesNew &&
      matchesSeasonal
    );
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'distance':
        return a.distance - b.distance;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const autocompleteSuggestions = Array.from(
    new Set([
      ...listings.map(item => item.title),
      ...listings.map(item => item.seller),
      ...categories.map(category => category.name)
    ])
  )
    .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  // Language Selector Component
  const LanguageSelector = () => (
    <div className="bg-white border-b">
      <div className="flex gap-2 p-4 pb-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            language === 'en' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          English
        </button>
        <button
          onClick={() => { setLanguage('ur'); setNumeralSystem('urdu'); }}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            language === 'ur' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          اردو
        </button>
        <button
          onClick={() => { setLanguage('hi'); setNumeralSystem('devanagari'); }}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            language === 'hi' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          हिंदी
        </button>
      </div>
      
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() => setNumeralSystem('western')}
          className={`px-2 py-1 rounded text-xs ${
            numeralSystem === 'western' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          0-9
        </button>
        {language === 'ur' && (
          <button
            onClick={() => setNumeralSystem('urdu')}
            className={`px-2 py-1 rounded text-xs ${
              numeralSystem === 'urdu' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            ۰-۹
          </button>
        )}
        {language === 'hi' && (
          <button
            onClick={() => setNumeralSystem('devanagari')}
            className={`px-2 py-1 rounded text-xs ${
              numeralSystem === 'devanagari' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            ०-९
          </button>
        )}
      </div>
    </div>
  );

  // Header Component
  const Header = () => (
    <div className="bg-green-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">{t('appName')}</h1>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5" />
          <Bell className="w-5 h-5" />
          {user ? (
            <UserCircle className="w-8 h-8" />
          ) : (
            <button
              onClick={() => setCurrentScreen('auth')}
              className="bg-green-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="w-full pl-10 pr-20 py-3 rounded-lg border-0 text-gray-800 text-lg placeholder-gray-500"
        />
        <div className="absolute right-3 top-3 flex gap-2">
          <button 
            onClick={startVoiceSearch}
            className={`p-1 rounded ${isListening ? 'bg-red-100 text-red-600' : 'text-gray-400'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button onClick={() => setFilterModal(true)}>
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {showSuggestions && searchQuery && autocompleteSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
            {autocompleteSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ item }: { item: Listing }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
        <span className="text-6xl">{item.image}</span>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isFeatured && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {t('featured_seller')}
            </div>
          )}
          {item.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {t('new_listing')}
            </div>
          )}
          {item.seasonal && item.seasonTag && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t('fresh')} — {t(item.seasonTag)}
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={() => speakListing(item)}
            className={`bg-white p-2 rounded-full shadow-md ${isSpeaking ? 'bg-blue-50' : ''}`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-blue-600" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
          </button>
          <button
            onClick={() => {
              if (favorites.includes(item.id)) {
                setFavorites(favorites.filter(f => f !== item.id));
              } else {
                setFavorites([...favorites, item.id]);
              }
            }}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg flex-1">{item.title}</h3>
          {item.isVerified && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <Shield className="w-4 h-4" />
              {t('verified')}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-green-600 font-bold text-xl">{formatPrice(item.price)}</div>
            <div className="text-sm text-gray-500">per {t(item.unit)}</div>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm text-gray-600">{formatNumber(item.rating)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{item.location} • {formatNumber(item.distance)}km</span>
          </div>
          <div className="text-sm text-gray-500">{item.lastSeen}</div>
        </div>
        
        <div className="flex gap-2 mb-3 flex-wrap">
          {item.unitOptions.map(unit => (
            <button
              key={unit}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {t(unit.replace(' ', '_'))}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setSelectedListing(item);
              setShowBargainModal(true);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {t('makeOffer')}
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t('contact')}
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg">
            <Phone className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100">
          <button className="flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3" />
            {t('report')}
          </button>
          <button className="flex items-center gap-1 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            {t('block')}
          </button>
        </div>
      </div>
    </div>
  );

  // Bargain Modal
  const BargainModal = () => {
    const [offerPrice, setOfferPrice] = useState(selectedListing?.price || 0);
    
    if (!showBargainModal || !selectedListing) return null;

    const quickOffers = [-100, -50, +50, +100].map(delta => selectedListing.price + delta);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="bg-white rounded-t-2xl w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{t('makeOffer')}</h3>
            <button onClick={() => setShowBargainModal(false)}>✕</button>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Current price: {formatPrice(selectedListing.price)}</div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">Your offer:</span>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseInt(e.target.value) || 0)}
                className="flex-1 p-2 border rounded-lg text-center font-bold text-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickOffers.map(price => (
              <button
                key={price}
                onClick={() => setOfferPrice(price)}
                className={`p-3 rounded-lg border-2 font-medium ${
                  price < selectedListing.price 
                    ? 'border-green-200 bg-green-50 text-green-700' 
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {formatPrice(price)}
                <div className="text-xs">
                  {price < selectedListing.price ? 
                    <TrendingDown className="w-3 h-3 inline ml-1" /> : 
                    <TrendingUp className="w-3 h-3 inline ml-1" />
                  }
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowBargainModal(false)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            Send Offer
          </button>
        </div>
      </div>
    );
  };

  // Filter Modal
const FilterModal = () => {
    if (!filterModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="bg-white rounded-t-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{t('filters')}</h3>
            <button onClick={() => setFilterModal(false)}>✕</button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">{t('price')} Range</h4>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="flex-1 p-2 border rounded-lg"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">{t('distance')}: {formatNumber(distanceRange)}km</h4>
            <input
              type="range"
              min="1"
              max="100"
              value={distanceRange}
              onChange={(e) => setDistanceRange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Advanced Filters
              <span className={`transform transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showAdvancedFilters ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Minimum Rating: {formatNumber(minRating)}</h4>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      verifiedOnly ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200'
                    }`}
                  >
                    Verified Only
                  </button>
                  <button
                    onClick={() => setNewOnly(!newOnly)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      newOnly ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200'
                    }`}
                  >
                    New Listings
                  </button>
                  <button
                    onClick={() => setSeasonalOnly(!seasonalOnly)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      seasonalOnly ? 'border-orange-600 bg-orange-50 text-orange-800' : 'border-gray-200'
                    }`}
                  >
                    Seasonal Items
                  </button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="relevance">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="distance">Closest</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">{t('categories')}</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-full border-2 flex items-center gap-2 ${                     selectedCategory === category.id                       ? 'border-green-600 bg-green-50 text-green-800'                       : 'border-gray-200 bg-white text-gray-600'                   }`}
>
<span>{category.icon}</span>
<span className="text-sm font-medium">{category.name}</span>
</button>
))}
</div>
</div>
      <div className="flex gap-3">
        <button 
          onClick={() => {
            setPriceRange([0, 10000]);
            setDistanceRange(50);
            setSelectedCategory('all');
            setMinRating(0);
            setVerifiedOnly(false);
            setNewOnly(false);
            setSeasonalOnly(false);
            setSortBy('relevance');
          }}
          className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
        >
          Clear All
        </button>
        <button 
          onClick={() => setFilterModal(false)}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
);
};

const AnalyticsDashboard = () => (
  <div className="p-4 bg-white border-b">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold text-lg">Analytics Dashboard</h2>
      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Listing Performance</span>
    </div>
    <div className="grid grid-cols-3 gap-3 text-center mb-4">
      <div className="bg-green-50 rounded-lg p-3">
        <div className="text-lg font-bold text-green-700">1.2k</div>
        <div className="text-xs text-gray-600">Views</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-lg font-bold text-blue-700">86</div>
        <div className="text-xs text-gray-600">Inquiries</div>
      </div>
      <div className="bg-orange-50 rounded-lg p-3">
        <div className="text-lg font-bold text-orange-700">24</div>
        <div className="text-xs text-gray-600">Sales</div>
      </div>
    </div>
    <div className="space-y-2">
      {[
        { label: 'Handwoven Carpet', value: 78 },
        { label: 'Organic Mangoes', value: 92 },
        { label: 'Clay Pottery Set', value: 64 }
      ].map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs w-28 text-gray-600">{item.label}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${item.value}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

const MapSection = () => (
  <div className="p-4 bg-white border-b">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold text-lg">Nearby Sellers Map</h2>
      <span className="text-xs text-gray-500">Map Integration</span>
    </div>
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-dashed border-green-200">
      <div className="flex items-center gap-2 text-green-700 mb-3">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Multan • Faisalabad • Hala</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Fatima Bibi', distance: '2.3km' },
          { name: 'Ustad Ali', distance: '3.1km' },
          { name: 'Ahmad Khan', distance: '5.4km' },
          { name: 'Iqbal Farm', distance: '7.8km' }
        ].map((seller) => (
          <div key={seller.name} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm font-medium">{seller.name}</div>
            <div className="text-xs text-gray-500">{seller.distance} away</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotificationCenter = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b">
      <h3 className="font-bold">Notification Center</h3>
      <button className="text-sm text-green-600">Mark all read</button>
    </div>
    <div className="divide-y">
      {notifications.map(note => (
        <div key={note.id} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{note.message}</p>
            <p className="text-xs text-gray-500">{note.time}</p>
          </div>
          <button className="text-xs text-gray-400 hover:text-gray-600">Manage</button>
        </div>
      ))}
    </div>
  </div>
);
// Categories Section
const CategoriesSection = () => (
  <div className="p-4 bg-white">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold text-lg">{t('categories')}</h2>
      <button className="text-green-600 text-sm font-medium">{t('viewAll')}</button>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl border-2 min-w-24 transition-all ${
            selectedCategory === category.id
              ? 'border-green-600 bg-green-50 shadow-md scale-105'
              : 'border-gray-200 bg-white shadow-sm'
          }`}
        >
          <span className="text-3xl">{category.icon}</span>
          <span className="text-sm font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  </div>
);
// Home Screen
const HomeScreen = () => (
<div className="flex-1 bg-gray-50 overflow-y-auto">
<Header />
<LanguageSelector />
<AnalyticsDashboard />
<CategoriesSection />
<MapSection />
  <div className="bg-white px-4 py-3 border-b">
    <div className="flex justify-between text-center">
      <div>
        <div className="text-lg font-bold text-green-600">{formatNumber(filteredListings.length)}</div>
        <div className="text-xs text-gray-600">Products</div>
      </div>
      <div>
        <div className="text-lg font-bold text-blue-600">
          {filteredListings.length === 0
            ? '0'
            : formatNumber(
                Math.round(filteredListings.reduce((acc, item) => acc + item.distance, 0) / filteredListings.length)
              )}
        </div>
        <div className="text-xs text-gray-600">Avg Distance (km)</div>
      </div>
      <div>
        <div className="text-lg font-bold text-orange-600">{formatNumber(filteredListings.filter(item => item.isVerified).length)}</div>
        <div className="text-xs text-gray-600">{t('verified')}</div>
      </div>
    </div>
  </div>
  
  <div className="flex items-center justify-between p-4 bg-white border-b">
    <h2 className="font-bold text-lg">{t('nearYou')}</h2>
    <div className="flex gap-2">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
      >
        <Grid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  </div>
  
  <div className="p-4">
    {sortedListings.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-600 text-lg mb-4">No products found</p>
        <button 
          onClick={() => setCurrentScreen('sell')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          {t('addListing')}
        </button>
      </div>
    ) : (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
        {sortedListings.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    )}
  </div>
</div>
);
// Add Listing Screen
const AddListingScreen = () => {
const [listingData, setListingData] = useState({
title: '',
description: '',
price: '',
category: '',
unit: 'kg',
location: ''
});
const [imagePreviews, setImagePreviews] = useState<Array<{ id: number; src: string; name: string; size: string; compressed: string }>>([]);
const [isRecording, setIsRecording] = useState(false);
const [recordingField, setRecordingField] = useState('');
const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []).slice(0, 5);
  const nextPreviews: Array<{ id: number; src: string; name: string; size: string; compressed: string }> = [];

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      const sizeKb = Math.round(file.size / 1024);
      const compressedKb = Math.round(sizeKb * 0.65);
      nextPreviews.push({
        id: Date.now() + index,
        src: reader.result as string,
        name: file.name,
        size: `${sizeKb}kb`,
        compressed: `${compressedKb}kb`
      });
      if (nextPreviews.length === files.length) {
        setImagePreviews(prev => [...prev, ...nextPreviews]);
      }
    };
    reader.readAsDataURL(file);
  });
};
const startVoiceInput = (field: string) => {
  setIsRecording(true);
  setRecordingField(field);
  setTimeout(() => {
    if (field === 'title') {
      setListingData({...listingData, title: 'Fresh Basmati Rice'});
    } else if (field === 'description') {
      setListingData({...listingData, description: 'Premium quality basmati rice, freshly harvested'});
    } else if (field === 'price') {
      setListingData({...listingData, price: '120'});
    }
    setIsRecording(false);
    setRecordingField('');
  }, 2000);
};

return (
  <div className="flex-1 bg-gray-50 overflow-y-auto">
    <div className="bg-green-600 text-white p-4">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setCurrentScreen('home')}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('addListing')}</h1>
      </div>
    </div>
    
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Add Photos
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-3">Add up to 5 clear photos</p>
          <p className="text-xs text-gray-500 mb-4">💡 Tip: Images are auto-compressed to save data.</p>
          <label className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer">
            Choose Photos
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {imagePreviews.map((preview) => (
              <div key={preview.id} className="bg-gray-50 rounded-lg p-2">
                <img src={preview.src} alt={preview.name} className="w-full h-24 object-cover rounded-md mb-2" />
                <div className="text-xs text-gray-600 truncate">{preview.name}</div>
                <div className="text-[10px] text-gray-400">Original: {preview.size} → Compressed: {preview.compressed}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
        <h3 className="font-bold flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Details
        </h3>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Product Title (e.g., Fresh Mangoes)"
            value={listingData.title}
            onChange={(e) => setListingData({...listingData, title: e.target.value})}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-lg"
          />
          <button 
            onClick={() => startVoiceInput('title')}
            className={`absolute right-3 top-3 ${isRecording && recordingField === 'title' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <textarea
            placeholder={`${t('description')} (quality, condition, etc.)`}
            value={listingData.description}
            onChange={(e) => setListingData({...listingData, description: e.target.value})}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg h-24 resize-none"
          />
          <button 
            onClick={() => startVoiceInput('description')}
            className={`absolute right-3 top-3 ${isRecording && recordingField === 'description' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              placeholder={`${t('price')}`}
              value={listingData.price}
              onChange={(e) => setListingData({...listingData, price: e.target.value})}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-lg"
            />
            <button 
              onClick={() => startVoiceInput('price')}
              className={`absolute right-3 top-3 ${isRecording && recordingField === 'price' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <select 
            value={listingData.unit}
            onChange={(e) => setListingData({...listingData, unit: e.target.value})}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="kg">{t('kg')}</option>
            <option value="seer">{t('seer')}</option>
            <option value="maund">{t('maund')}</option>
            <option value="bag5kg">{t('bag5kg')}</option>
            <option value="bag10kg">{t('bag10kg')}</option>
            <option value="piece">Piece</option>
          </select>
        </div>
        
        <select 
          value={listingData.category}
          onChange={(e) => setListingData({...listingData, category: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
        >
          <option value="">Select Category</option>
          <option value="crafts">🎨 {t('crafts')}</option>
          <option value="food">🍎 {t('food')}</option>
          <option value="textiles">🧵 {t('textiles')}</option>
          <option value="farming">🌾 {t('farming')}</option>
        </select>
      </div>
      
      <div className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
        <h3 className="font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t('location')}
        </h3>
        <input
          type="text"
          placeholder="City/Village (approximate area only)"
          value={listingData.location}
          onChange={(e) => setListingData({...listingData, location: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          We only show your general area, not exact address
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold mb-3">Seasonal Tags (Optional)</h3>
        <div className="flex flex-wrap gap-2">
          {['fresh', 'seasonal', 'monsoon', 'winter', 'harvest'].map(tag => (
            <button
              key={tag}
              className="px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              {t(tag)}
            </button>
          ))}
        </div>
      </div>
      
      <button className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg">
        Post Listing
      </button>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-center gap-2 text-yellow-800">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Safety Tip</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Meet buyers in public places. Don't share personal details until you're comfortable.
        </p>
      </div>
    </div>
  </div>
);
};
// Messages Screen
const MessagesScreen = () => (
<div className="flex-1 bg-gray-50 overflow-y-auto">
<div className="bg-green-600 text-white p-4">
<h1 className="text-xl font-bold">{t('messages')}</h1>
</div>
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold">Real-time Chat</h2>
          <p className="text-xs text-gray-500">Connected • Typing indicator enabled</p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-green-600" />
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 max-w-[70%]">
            Hi! Is the mango batch still available today?
          </div>
        </div>
        <div className="flex items-start gap-2 justify-end">
          <div className="bg-green-600 text-white rounded-lg px-3 py-2 text-sm max-w-[70%]">
            Yes, freshly picked this morning. I can reserve 10kg for you.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 max-w-[70%]">
            Great! Please share EasyPaisa details.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button className="bg-green-600 text-white p-2 rounded-lg">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
    {[
      { name: 'Ahmad Khan', message: 'Interested in your clay pottery...', time: '2h', unread: true, verified: true },
      { name: 'Fatima Bibi', message: 'What\'s the best price for mangoes?', time: '5h', unread: false, verified: true },
      { name: 'Ali Hassan', message: 'Can you deliver to Lahore?', time: '1d', unread: false, verified: false }
    ].map((chat, i) => (
      <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center relative">
          <User className="w-6 h-6 text-green-600" />
          {chat.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{chat.name}</h3>
            {chat.unread && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          <p className="text-gray-600 text-sm">{chat.message}</p>
          <p className="text-xs text-gray-400">{chat.time}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    ))}
  </div>
</div>
);
// Profile Screen
const ProfileScreen = () => (
<div className="flex-1 bg-gray-50 overflow-y-auto">
<div className="bg-green-600 text-white p-4">
<h1 className="text-xl font-bold">{t('profile')}</h1>
</div>
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-xl p-6 text-center shadow-sm">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 relative">
        <User className="w-10 h-10 text-green-600" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
      </div>
      <h2 className="text-xl font-bold">Fatima Bibi</h2>
      <p className="text-gray-600">Multan, Pakistan</p>
      <div className="flex items-center justify-center gap-1 mt-2">
        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        <span className="font-medium">{formatNumber(4.8)}</span>
        <span className="text-gray-600">({formatNumber(124)} reviews)</span>
      </div>
      
      <div className="flex justify-center gap-2 mt-3">
        <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Phone Verified
        </div>
        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          Top Seller
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Seller Profile</h3>
        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Top Seller</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Selling organic produce and handmade crafts since 2019. Response time under 15 minutes.
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-bold">96%</div>
          <div className="text-xs text-gray-500">Response</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-bold">148</div>
          <div className="text-xs text-gray-500">Orders</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-bold">4.9</div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {[
        { icon: Package, label: 'My Listings', count: '3', color: 'text-blue-600' },
        { icon: Heart, label: t('favorites'), count: favorites.length, color: 'text-red-600' },
        { icon: Bell, label: t('notifications'), count: notifications.length, color: 'text-orange-600' },
        { icon: Settings, label: t('settings'), color: 'text-gray-600' }
      ].map((item, i) => (
        <button key={i} className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.count && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                {formatNumber(Number(item.count))}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>

    <NotificationCenter />

    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-bold mb-3">Payment Integration Setup</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div>
            <div className="text-sm font-medium">EasyPaisa</div>
            <div className="text-xs text-gray-500">Ready to connect</div>
          </div>
          <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Enable</button>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div>
            <div className="text-sm font-medium">JazzCash</div>
            <div className="text-xs text-gray-500">Connected</div>
          </div>
          <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Manage</button>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-bold mb-3">Firebase Configuration</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium">Authentication</div>
          <div className="text-xs text-green-600">Enabled</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium">Database</div>
          <div className="text-xs text-green-600">Realtime Sync</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Secure access rules configured for buyers and sellers.
      </div>
    </div>
  </div>
</div>
);
// Bottom Navigation
const BottomNav = () => (
<div className="bg-white border-t border-gray-200 p-2 shadow-lg">
<div className="flex justify-around">
{[
{ id: 'home', icon: Home, label: t('home') },
{ id: 'sell', icon: Plus, label: t('sell') },
{ id: 'messages', icon: MessageCircle, label: t('messages'), badge: 2 },
{ id: 'profile', icon: UserCircle, label: t('profile') }
].map(item => (
<button
key={item.id}
onClick={() => setCurrentScreen(item.id)}
className={`flex flex-col items-center gap-1 p-3 rounded-xl relative transition-all ${
  currentScreen === item.id
    ? 'text-green-600 bg-green-50 scale-105'
    : 'text-gray-600 hover:text-gray-800'
}`}
>
<item.icon className="w-6 h-6" />
<span className="text-xs font-medium">{item.label}</span>
{item.badge && (
<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
{formatNumber(item.badge)}
</div>
)}
</button>
))}
</div>
</div>
);
return (
<div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
{currentScreen === 'home' && <HomeScreen />}
{currentScreen === 'sell' && <AddListingScreen />}
{currentScreen === 'messages' && <MessagesScreen />}
{currentScreen === 'profile' && <ProfileScreen />}
  <BargainModal />
  <FilterModal />
  
  <BottomNav />
  
  {isListening && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 shadow-lg">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      {t('voiceSearch')}...
    </div>
  )}
</div>
);
}
export default App;
