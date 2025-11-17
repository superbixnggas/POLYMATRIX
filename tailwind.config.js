/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: '#2a2a3e',
				input: '#1e1e2e',
				ring: '#6366f1',
				background: '#0a0a12',
				foreground: '#ffffff',
				primary: {
					DEFAULT: '#6366f1',
					foreground: '#ffffff',
					50: '#eef2ff',
					100: '#e0e7ff',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
				},
				secondary: {
					DEFAULT: '#8b5cf6',
					foreground: '#ffffff',
				},
				accent: {
					DEFAULT: '#d946ef',
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#1e1e2e',
					foreground: '#94a3b8',
				},
				popover: {
					DEFAULT: '#0f0f1a',
					foreground: '#ffffff',
				},
				card: {
					DEFAULT: '#1a1a2e',
					foreground: '#ffffff',
				},
				success: {
					DEFAULT: '#10b981',
					foreground: '#ffffff',
				},
				warning: {
					DEFAULT: '#f59e0b',
					foreground: '#000000',
				},
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px',
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
				'gradient-dark': 'linear-gradient(180deg, #0a0a12 0%, #1a1a2e 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
