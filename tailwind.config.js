/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      spacing: { toque: '48px' },
      colors: {
        verde: '#1F6B4F',
        'verde-claro': '#E3F1EA',
        texto: '#18211D',
        'texto-apoio': '#56615B',
        fundo: '#F6F7F5',
        cartao: '#FFFFFF',
        borda: '#DDE2DE',
        erro: '#B42318',
        'erro-claro': '#FDECEA',
      },
      fontSize: { titulo: 24, secao: 18, corpo: 16, legenda: 13 },
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
