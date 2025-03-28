module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-border': '#303d4f',
        'custom-hover': '#777777',
        'custom-text': '#aaaaaa',
        'custom-background': '#0d1117',
        'card-background': '#0d1117',
        'text-normal': '#919fae',
        'text-emphasizing': '#efefef',
        'link-color': '#76bbf9',
        'hover-border': '#4b5b71', // New hover border color
        'hover-text': '#efefef', // Emphasizing text on hover
        'hover-underline': '#76bbf9', // Underline color on hover
        'sapphire': '#006bff', // Sapphire button color
        'sapphire-hover': '#4443f5', // Sapphire button hover color
      },
      borderWidth: {
        'thin': '1px',
      },
      borderRadius: {
        'small': '4px',
      },
      boxShadow: {
        'bright': '0 0 35px rgba(200, 200, 255, 0.2)',
        'shine': '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)', // shine effect
      },
      fontSize: {
        's1': '12px', // Adding small font size
      },

    },
  },
  plugins: [],
}