import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bsd-black': '#000000',
        'bsd-dark': '#0a0a0a',
        'bsd-gray-900': '#1a1a1a',
        'bsd-gray-800': '#262626',
        'bsd-gray-700': '#404040',
        'bsd-gray-600': '#525252',
        'bsd-gray-400': '#94a3b8',
        'bsd-gray-300': '#cbd5e1',
        'bsd-blue-600': '#2563eb',
        'bsd-blue-700': '#1d4ed8',
        'bsd-blue-500': '#3b82f6',
      },
    },
  },
  plugins: [],
}
export default config
