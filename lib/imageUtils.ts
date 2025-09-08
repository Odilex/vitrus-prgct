/**
 * Image utility functions for handling default images and fallbacks
 */

// Default image paths
export const DEFAULT_IMAGES = {
  property: '/images/default-property.jpg',
  propertySvg: '/images/default-property.svg',
  user: '/images/default-user.jpg',
  avatar: '/images/default-avatar.jpg',
  testimonial: '/images/default-testimonial.jpg',
  service: '/images/default-service.jpg',
} as const;

/**
 * Get a fallback image URL based on the type
 */
export function getDefaultImage(type: keyof typeof DEFAULT_IMAGES): string {
  return DEFAULT_IMAGES[type];
}

/**
 * Generate a placeholder image URL using local fallback images
 */
export function getPlaceholderImage(_width: number = 400, _height: number = 300, _category: string = 'architecture'): string {
  // Use local default images instead of external services to avoid CORS/ORB issues
  return getDefaultImage('property');
}

/**
 * Check if an image URL is safe to use (local or trusted domain)
 */
export function isImageUrlSafe(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  // Allow relative paths
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true;
  }
  
  // Allow localhost URLs
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return true;
  }
  
  // Block known external placeholder services
  const blockedDomains = [
    'placeholder',
    'unsplash.com',
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'placehold.it',
    'dummyimage.com',
    'lorempixel.com'
  ];
  
  return !blockedDomains.some(domain => url.toLowerCase().includes(domain));
}

/**
 * Generate avatar placeholder with initials
 */
export function getAvatarPlaceholder(name: string, size: number = 100): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Use a service like UI Avatars or generate locally
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=3b82f6&color=ffffff&bold=true`;
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get image with fallback handling
 */
export function getImageWithFallback(
  primaryUrl: string | null | undefined,
  fallbackType: keyof typeof DEFAULT_IMAGES
): string {
  // If no primary URL, use local default
  if (!primaryUrl || primaryUrl.trim() === '') {
    return getDefaultImage(fallbackType);
  }
  
  // Check for external URLs that might cause CORS/ORB issues
  const externalDomains = [
    'placeholder',
    'unsplash.com',
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'placehold.it',
    'dummyimage.com',
    'lorempixel.com'
  ];
  
  const hasExternalDomain = externalDomains.some(domain => 
    primaryUrl.toLowerCase().includes(domain)
  );
  
  if (hasExternalDomain) {
    return getDefaultImage(fallbackType);
  }
  
  // Check if it's a relative path or local URL
  if (primaryUrl.startsWith('/') || primaryUrl.startsWith('./') || primaryUrl.startsWith('../')) {
    return primaryUrl;
  }
  
  // Check if it's a localhost URL
  if (primaryUrl.includes('localhost') || primaryUrl.includes('127.0.0.1')) {
    return primaryUrl;
  }
  
  // For any other external URL, use fallback to avoid potential issues
  if (primaryUrl.startsWith('http://') || primaryUrl.startsWith('https://')) {
    console.warn(`External image URL detected, using fallback: ${primaryUrl}`);
    return getDefaultImage(fallbackType);
  }
  
  return primaryUrl;
}

/**
 * Generate property image placeholder
 */
export function getPropertyImagePlaceholder(propertyType?: string, useSvg: boolean = false): string {
  // Use SVG version for better scalability and loading performance
  if (useSvg) {
    return getDefaultImage('propertySvg');
  }
  const category = propertyType?.toLowerCase().includes('commercial') ? 'office' : 'house';
  return getPlaceholderImage(800, 600, category);
}

/**
 * Generate testimonial avatar
 */
export function getTestimonialAvatar(name: string): string {
  return getAvatarPlaceholder(name, 80);
}