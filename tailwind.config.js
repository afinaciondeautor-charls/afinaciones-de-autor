/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vw: {
          dark: '#001E50',    // Volkswagen Classic Deep Navy Blue
          blue: '#00509E',    // Volkswagen Royal Blue
          electric: '#0066D6',// Volkswagen Electric / Bright Blue
          sky: '#E6F0FA',     // Soft Ice / Light Blue Tint
        },
        brand: {
          yellow: '#FFC72C',  // High-visibility Performance Yellow
          amber: '#F59E0B',   // Deep Amber / Gold
          pearl: '#F8FAFC',   // Pearl White / Slate 50
        }
      },
    },
  },
  plugins: [],
};
