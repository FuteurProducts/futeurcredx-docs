/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Shade scale
        shade: {
          '01': 'var(--shade-01)',
          '02': 'var(--shade-02)',
          '03': 'var(--shade-03)',
          '04': 'var(--shade-04)',
          '05': 'var(--shade-05)',
          '06': 'var(--shade-06)',
          '07': 'var(--shade-07)',
          '08': 'var(--shade-08)',
          '09': 'var(--shade-09)',
          '10': 'var(--shade-10)',
        },
        // Primary palette
        'primary-01': 'var(--primary-01)',
        'primary-02': 'var(--primary-02)',
        'primary-03': 'var(--primary-03)',
        'primary-04': 'var(--primary-04)',
        'primary-05': 'var(--primary-05)',
        // Semantic backgrounds
        'b-surface1': 'var(--b-surface1)',
        'b-surface2': 'var(--b-surface2)',
        'b-highlight': 'var(--b-highlight)',
        'b-depth': 'var(--b-depth)',
        // Semantic text
        't-primary': 'var(--t-primary)',
        't-secondary': 'var(--t-secondary)',
        't-tertiary': 'var(--t-tertiary)',
        // Semantic strokes
        's-border': 'var(--s-border)',
        's-subtle': 'var(--s-subtle)',
        's-stroke2': 'var(--s-stroke2)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
      },
      boxShadow: {
        'widget': 'var(--shadow-widget)',
        'depth': 'var(--shadow-depth)',
        'dropdown': 'var(--shadow-dropdown)',
      },
      fontSize: {
        'h1': ['6rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '300' }],
        'h2': ['3.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'h3': ['3rem', { lineHeight: '1.25', fontWeight: '500' }],
        'h4': ['2rem', { lineHeight: '1.45', letterSpacing: '0.003em', fontWeight: '600' }],
        'h5': ['1.5rem', { lineHeight: '1.45', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h6': ['1.25rem', { lineHeight: '1.45', letterSpacing: '-0.01em', fontWeight: '600' }],
        'sub-title-1': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.015em', fontWeight: '600' }],
        'sub-title-2': ['0.875rem', { lineHeight: '1.55', letterSpacing: '-0.015em', fontWeight: '700' }],
        'body-1': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
        'body-2': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        'button': ['0.875rem', { lineHeight: '1', letterSpacing: '-0.015em', fontWeight: '600' }],
        'caption': ['0.75rem', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

