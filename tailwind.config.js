// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        {
            pattern: /(bg|text|border)-(red|blue|green|purple|gray)-(100|200|300|400|500|600|700)/,
        },
        {
            pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/,
        },
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
