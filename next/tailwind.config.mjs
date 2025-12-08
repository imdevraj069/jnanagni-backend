/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jnanagni: {
          dark: '#05010d',    // Deep void black
          primary: '#7c3aed', // Violet
          accent: '#06b6d4',  // Cyan
          pink: '#db2777',    // Pink
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],    // mapped in layout.js
        display: ['var(--font-orbitron)'], // mapped in layout.js
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to bottom, rgba(5,1,13,0.8), rgba(5,1,13,1)), url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')",
        'glow-gradient': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #db2777 100%)',
      }
    },
  },
  plugins: [],
};