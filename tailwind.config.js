/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                fuxion: {
                    blue: '#005fcc', // Example primary blue
                    teal: '#00897b', // Secondary
                    cleanse: '#4A148C', // Purple for cleanse
                    weight: '#D32F2F', // Red for weight
                    immune: '#E65100', // Orange for immune
                    sport: '#212121', // Dark for sport
                }
            }
        },
    },
    plugins: [],
}
