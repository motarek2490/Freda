/**
 * Design Tokens System for FRIDA / Vowly
 * Centralized, tokenized design foundation for upcoming phased design refreshes.
 *
 * NOTE: These tokens are defined as pure data structures and utilities without modifying
 * or breaking existing runtime styles or components.
 */

export const colors = {
  // Brand Core Colors
  base: '#080808',
  ivory: '#F4EFE7',
  warmGold: '#C9A86A',
  champagne: '#D9C8A5',
  deepBurgundy: '#3B101B',

  // Semantic Layers
  background: {
    base: '#080808',
    surface: '#111111',
    card: '#161616',
    overlay: 'rgba(8, 8, 8, 0.85)',
    subtle: '#1C1C1C',
  },

  text: {
    primary: '#F4EFE7',
    secondary: '#D9C8A5',
    muted: '#9E988F',
    inverted: '#080808',
    accent: '#C9A86A',
  },

  gold: {
    light: '#E6D7B8',
    champagne: '#D9C8A5',
    warm: '#C9A86A',
    dark: '#9B783E',
    shadow: 'rgba(201, 168, 106, 0.25)',
  },

  border: {
    subtle: 'rgba(244, 239, 231, 0.1)',
    gold: 'rgba(201, 168, 106, 0.3)',
    goldProminent: '#C9A86A',
  },
} as const;

export const typography = {
  // Font Families
  fonts: {
    display: {
      ar: "'Amiri', 'Noto Naskh Arabic', serif",
      en: "'Cormorant Garamond', 'Playfair Display', serif",
    },
    interface: {
      ar: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
      en: "'Plus Jakarta Sans', sans-serif",
    },
  },

  // Typography Scales
  scale: {
    display: {
      hero: {
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        lineHeight: '1.15',
        fontWeight: '700',
      },
      titleLarge: {
        fontSize: 'clamp(2rem, 3.5vw, 3rem)',
        lineHeight: '1.2',
        fontWeight: '600',
      },
      titleMedium: {
        fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        lineHeight: '1.3',
        fontWeight: '600',
      },
      titleSmall: {
        fontSize: 'clamp(1.25rem, 1.8vw, 1.625rem)',
        lineHeight: '1.35',
        fontWeight: '500',
      },
    },
    interface: {
      bodyLarge: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.6',
        fontWeight: '400',
      },
      bodyMedium: {
        fontSize: '1rem', // 16px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      bodySmall: {
        fontSize: '0.875rem', // 14px
        lineHeight: '1.45',
        fontWeight: '400',
      },
      caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: '1.4',
        fontWeight: '500',
      },
      overline: {
        fontSize: '0.6875rem', // 11px
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '0.1em',
      },
    },
  },
} as const;

export const motion = {
  // Micro-interactions (hover, tap, icon toggles, dropdowns)
  micro: {
    fast: 180, // ms
    default: 250, // ms
    slow: 350, // ms
  },

  // Major transitions (modal opening, page view swaps, envelope unfold, hero sequences)
  major: {
    fast: 800, // ms
    default: 1000, // ms
    slow: 1400, // ms
  },

  // Premium easing curves
  easings: {
    luxury: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth deceleration for luxury feel
    editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const designTokens = {
  colors,
  typography,
  motion,
} as const;

export default designTokens;
