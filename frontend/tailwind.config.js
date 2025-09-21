/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Royal Sky Blue - اللون السماوي الملكي
        'royal-sky': {
          'DEFAULT': '#07ECF7', // اللون السماوي الأساسي
          'light': '#5FF4FC', // سماوي فاتح
          'dark': '#00B8C2', // سماوي غامق
          'darker': '#008A92', // سماوي غامق جداً
        },
        
        // Primary brand colors - محدث بالسماوي الملكي
        'primary': {
          'day': '#07ECF7', // سماوي ملكي للوضع النهاري
          'night': '#07ECF7', // سماوي ملكي للوضع الليلي
          'dark': '#00B8C2', // سماوي غامق للأزرار
        },
        
        // Background colors - خلفيات محدثة
        'bg': {
          'day': '#E6FDFE', // سماوي فاتح جداً للنهار
          'night': '#000000', // أسود للوضع الليلي
          'card-day': '#F0FEFF', // كروت بسماوي فاتح
          'card-night': '#0A0A0A', // كروت بأسود فاتح قليلاً
          'surface-day': '#D8FCFD', // أسطح بسماوي فاتح
          'surface-night': '#111111', // أسطح بأسود
        },
        
        // Text colors - ألوان النصوص
        'text': {
          'day': '#000000', // أسود للوضع النهاري
          'night': '#07ECF7', // سماوي ملكي للوضع الليلي
          'secondary-day': '#1A1A1A', // رمادي غامق للنهار
          'secondary-night': '#5FF4FC', // سماوي فاتح للليل
        },
        
        // Platform name colors - ألوان اسم المنصة
        'brand': {
          'name-day': '#000000', // أسود في الوضع النهاري
          'name-night': '#07ECF7', // سماوي ملكي في الوضع الليلي
        },
        
        // Status colors
        'status': {
          'error': '#EF4444', // Red
          'success': '#10B981', // Green
          'warning': '#F59E0B', // Amber
          'info': '#3B82F6', // Blue
        },
        
        // Legacy colors - محدث بالسماوي الملكي
        'nawi-sky': '#07ECF7',
        'nawi-sky-light': '#5FF4FC',
        'nawi-sky-dark': '#00B8C2',
        'nawi-dark': '#000000',
        'nawi-dark-lighter': '#0A0A0A',
        'nawi-white': '#FFFFFF',
        'nawi-blue': '#07ECF7', // سماوي ملكي
        'nawi-purple': '#00B8C2', // سماوي غامق
        'nawi-light-blue': '#5FF4FC', // سماوي فاتح
        'nawi-light-purple': '#008A92', // سماوي غامق جداً
        'nawi-cyan': '#07ECF7',
        'nawi-cyan-light': '#5FF4FC',
        'nawi-gray': '#111111',
        'nawi-light': '#E6FDFE',
      },
      
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'arabic': ['Tajawal', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 32px
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16px
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
      },
      
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-dark': 'glow-dark 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'particle-float': 'particle-float 10s infinite linear',
      },
      
      keyframes: {
        glow: {
          from: { textShadow: '0 0 10px #07ECF7, 0 0 20px #07ECF7' },
          to: { textShadow: '0 0 20px #5FF4FC, 0 0 30px #5FF4FC' }
        },
        'glow-dark': {
          from: { textShadow: '0 0 10px #07ECF7, 0 0 20px #07ECF7' },
          to: { textShadow: '0 0 20px #00B8C2, 0 0 30px #00B8C2' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(7, 236, 247, 0.5)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 40px rgba(95, 244, 252, 0.8)',
          },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(10px)' },
          '50%': { transform: 'translateY(5px) translateX(-5px)' },
          '75%': { transform: 'translateY(-5px) translateX(-10px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-day': 'linear-gradient(135deg, #07ECF7 0%, #5FF4FC 100%)',
        'gradient-night': 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      },
      
      boxShadow: {
        'card-day': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-night': '0 4px 6px -1px rgba(7, 236, 247, 0.2), 0 2px 4px -1px rgba(7, 236, 247, 0.1)',
        'glow-day': '0 0 20px rgba(7, 236, 247, 0.4)',
        'glow-night': '0 0 20px rgba(7, 236, 247, 0.5)',
      },
    },
  },
  plugins: [],
}