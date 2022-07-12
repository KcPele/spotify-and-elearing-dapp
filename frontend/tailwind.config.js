module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
          container: {
            padding: {
              DEFAULT: '1rem',
              sm: '2rem',
              lg: '4rem',
              xl: '5rem',
              '2xl': '6rem',
            },
          },
              maxWidth: {
                '1/2': '50%',
              }
        },
    },
    plugins: [],
}
