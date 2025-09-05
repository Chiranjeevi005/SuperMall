// Design System for Super Mall - Indian Rural Theme
// Color palette inspired by Indian countryside, villages, and traditional markets
export const colors = {
  primary: {
    // Traditional Indian green representing farmland and nature
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main green - representing lush Indian farmlands
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  secondary: {
    // Warm Indian earth tones representing soil and traditional materials
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24', // Golden yellow - representing Indian wheat fields and turmeric
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  neutral: {
    // Cream and off-white colors representing natural materials like cotton and jute
    50: '#fffcf7', // Off-white like Indian cotton
    100: '#fff9f0',
    200: '#fdeed5', // Warm cream
    300: '#f9dcc5',
    400: '#f0c7a9',
    500: '#e2b08f',
    600: '#d19275',
    700: '#b97359',
    800: '#9c5945',
    900: '#7c4535',
  },
  accent: {
    // Vibrant Indian colors representing traditional textiles and festivals
    saffron: '#ff9933', // Indian saffron/orange
    white: '#ffffff',   // Pure white
    green: '#138808',   // Indian green
    // Additional accent colors for variety
    marigold: '#ffca28', // Marigold flowers used in Indian festivals
    indigo: '#3949ab',   // Indigo dye used in traditional textiles
    terracotta: '#e67e22', // Terracotta pottery
    emerald: '#2ecc71',   // Emerald jewelry
  },
  rural: {
    // Specific Indian rural theme colors
    wheat: '#f0d9b5',     // Wheat fields
    mud: '#8d6e63',       // Mud houses
    jute: '#a1887f',      // Jute fibers
    clay: '#d7ccc8',      // Clay pots
    sky: '#b3e5fc',       // Indian clear skies
    palm: '#81c784',      // Palm trees
    neem: '#66bb6a',      // Neem trees
  },
  // Traditional Indian textile and craft colors
  traditional: {
    // Colors inspired by Indian textiles, sarees, and crafts
    peacock: '#008080',    // Peacock blue
    ruby: '#e91e63',       // Ruby red
    turmeric: '#ffeb3b',   // Turmeric yellow
    sandalwood: '#f4bb44', // Sandalwood
    lotus: '#e91e63',      // Lotus pink
    jasmine: '#ffebcd',    // Jasmine white
  }
};

// Typography - Using fonts that reflect Indian aesthetics
export const typography = {
  fonts: {
    heading: 'var(--font-geist-sans), system-ui, sans-serif',
    body: 'var(--font-geist-sans), system-ui, sans-serif',
    // For a more Indian aesthetic, we could add:
    // decorative: 'Dancing Script, cursive', // For ornate headings
    // traditional: 'Noto Sans, sans-serif', // For supporting multiple Indian languages
    mono: 'var(--font-geist-mono), monospace',
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  leading: {
    tight: 1.25,
    normal: 1.5,
    loose: 1.75,
  }
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

// Shadows - Soft shadows to represent the gentle Indian sunlight
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  // Indian sun-inspired glow
  glow: '0 0 15px rgba(245, 158, 11, 0.3)', // Golden glow
};

// Border Radius - Mix of sharp and rounded to represent traditional architecture
export const borderRadius = {
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
  // Traditional Indian architectural elements
  traditional: '0.25rem', // Sharp corners like traditional buildings
  courtyard: '1rem',      // Rounded corners like courtyard edges
};

// Transitions
export const transitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.1s ease-in-out',
  slow: 'all 0.3s ease-in-out',
  // Traditional craft-inspired transitions
  weaving: 'all 0.4s ease-in-out', // Like the rhythm of handloom weaving
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Indian Rural Theme Specific Elements
export const indianRuralTheme = {
  // Patterns inspired by Indian textiles and crafts
  patterns: {
    block: 'bg-[length:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]',
    textile: 'bg-[length:40px_40px] bg-[radial-gradient(circle,#80808012_1px,transparent_1px)]',
    jute: 'bg-[length:30px_30px] bg-[repeating-linear-gradient(45deg,#f5d49e_0px,#f5d49e_2px,transparent_2px,transparent_10px)]',
  },
  // Decorative elements
  decorative: {
    border: 'border-2 border-amber-200',
    divider: 'h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent',
    ornament: 'text-amber-500',
  },
  // Cultural motifs
  motifs: {
    paisley: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z',
    lotus: 'M12 2L15 8L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 8L12 2Z',
    peacock: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z',
  }
};