/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['Arial', ...defaultTheme.fontFamily.sans],
			'open': ['"Open Sans Variable", sans-serif'],

		},
		screens: {
			xs: "540px",
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '12px',
				sm: '1rem',
				lg: '45px',
				xl: '5rem',
				'2xl': '13rem',
			},
		},
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'.prose strong': {
							color: theme('colors.secondary.DEFAULT'),
						},
						'.prose a': {
							color: theme('colors.secondary.DEFAULT'),
							'text-decoration': 'underline',
						},
						'.prose a:hover': {
							color: theme('colors.secondary.600'),
							'text-decoration': 'none',
						},
						'.prose h1, .prose h2, .prose h3, .prose h4, .prose h5': {
							color: theme('colors.secondary.DEFAULT'),
						},
					}
				}
			}),
			colors: {
				'dark-footer': '#192132',
				primary: {
					DEFAULT: '#007cb7',
					'50': '#f0f9ff',
					'100': '#e0f3fe',
					'200': '#b9e7fe',
					'300': '#7cd5fd',
					'400': '#36c1fa',
					'500': '#0caaeb',
					'600': '#007cb7',
					'700': '#016ca3',
					'800': '#065b86',
					'900': '#0b4c6f',
					'950': '#07304a',
				},
				secondary: {
					DEFAULT: '#404042',
					'50': '#f5f5f6',
					'100': '#e6e6e7',
					'200': '#d0d0d1',
					'300': '#aeaeb2',
					'400': '#86878a',
					'500': '#6b6c6f',
					'600': '#5b5b5f',
					'700': '#4e4e50',
					'800': '#404042',
					'900': '#3c3c3d',
					'950': '#262527',
				},
				accent: {
					DEFAULT: '#E84361',
					50: '#FFFFFF',
					100: '#FBDDE3',
					200: '#F9CBD4',
					300: '#F6B9C4',
					400: '#F4A7B5',
					500: '#F295A6',
					600: '#F08396',
					700: '#EE7087',
					800: '#EB5E78',
					900: '#E94C69',
					950: '#E84361'
				},
			},
			textShadow: {
				sm: "0 1px 2px var(--tw-shadow-color)",
				DEFAULT: "0 2px 4px var(--tw-shadow-color)",
				lg: "0 8px 16px var(--tw-shadow-color)",
			},
			boxShadow: {
				sm: '0 2px 4px 0 rgb(60 72 88 / 0.15)',
				DEFAULT: '0 0 3px rgb(60 72 88 / 0.15)',
				md: '0 5px 13px rgb(60 72 88 / 0.20)',
				lg: '0 10px 25px -3px rgb(60 72 88 / 0.15)',
				xl: '0 20px 25px -5px rgb(60 72 88 / 0.1), 0 8px 10px -6px rgb(60 72 88 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(60 72 88 / 0.25)',
				inner: 'inset 0 2px 4px 0 rgb(60 72 88 / 0.05)',
				testi: '2px 2px 2px -1px rgb(60 72 88 / 0.15)',
			},

			spacing: {
				0.75: '0.1875rem',
				3.25: '0.8125rem'
			},

			maxWidth: ({
						   theme,
						   breakpoints
					   }) => ({
				'1200': '71.25rem',
				'992': '60rem',
				'768': '45rem',
			}),

			zIndex: {
				1: '1',
				2: '2',
				3: '3',
				999: '999',
			},

		},
	},
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"text-shadow": (value) => ({
						textShadow: value,
					}),
				},
				{ values: theme("textShadow") }
			)
		}),
		require('flowbite/plugin'),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/typography"),
	],
}
