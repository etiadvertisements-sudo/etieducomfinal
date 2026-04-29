import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Apply Cloudinary transformations to image URLs.
 * Only transforms Cloudinary URLs; returns others unchanged.
 * 
 * Presets:
 *   thumb    → 150x150 face-crop (review avatars, team photos)
 *   avatar   → 200x200 face-crop
 *   card     → 400w auto-height (blog cards, event cards)
 *   hero     → 1200x630 fill (blog OG images, hero banners)
 *   logo     → 200w auto-height, fit (partner/university logos)
 *   gallery  → 600w auto-height (event gallery)
 *   full     → 1200w quality auto (full-size images)
 */
export function cloudImg(url, preset = 'card') {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  
  const transforms = {
    thumb:   'c_fill,g_face,w_150,h_150,q_auto,f_auto',
    avatar:  'c_fill,g_face,w_200,h_200,q_auto,f_auto',
    card:    'c_fill,w_400,q_auto,f_auto',
    hero:    'c_fill,w_1200,h_630,g_auto,q_auto,f_auto',
    logo:    'c_fit,w_200,q_auto,f_auto',
    gallery: 'c_fill,w_600,q_auto,f_auto',
    full:    'w_1200,q_auto,f_auto',
  };
  
  const t = transforms[preset] || transforms.card;
  return url.replace('/upload/', `/upload/${t}/`);
}
