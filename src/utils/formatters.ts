export type NumeralSystem = 'western' | 'urdu' | 'devanagari';

export const formatNumber = (num: number, system: NumeralSystem = 'western'): string => {
  const str = num.toString();
  
  if (system === 'urdu') {
    return str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  }
  
  if (system === 'devanagari') {
    return str.replace(/[0-9]/g, (d) => '०१२३४५६७८९'[parseInt(d)]);
  }
  
  return str;
};

export const formatPrice = (price: number, system: NumeralSystem = 'western'): string => {
  return `₨${formatNumber(price, system)}`;
};

export const formatDistance = (distance: number, system: NumeralSystem = 'western'): string => {
  return `${formatNumber(Math.round(distance * 10) / 10, system)}km`;
};

export const formatRating = (rating: number, system: NumeralSystem = 'western'): string => {
  return formatNumber(Math.round(rating * 10) / 10, system);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMins < 60) {
    return `${diffInMins} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};