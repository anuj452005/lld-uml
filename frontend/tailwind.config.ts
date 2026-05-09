import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: "#0D1117",
          surface: {
            primary: "#161B22",
            secondary: "#1C2128",
            tertiary: "#21262D",
          },
          overlay: "#0B0F14CC",
        },
        border: {
          primary: "#30363D",
          secondary: "#21262D",
          active: "#388BFD",
          error: "#F85149",
        },
        text: {
          primary: "#E6EDF3",
          secondary: "#9DA7B3",
          tertiary: "#6E7681",
          inverse: "#0D1117",
          error: "#FF7B72",
        },
        accent: {
          primary: {
            DEFAULT: "#388BFD",
            hover: "#4C9EFF",
            active: "#1F6FEB",
          },
          secondary: "#1F2937",
        },
        status: {
          success: "#3FB950",
          warning: "#D29922",
          error: "#F85149",
          info: "#58A6FF",
        },
        diagram: {
          node: {
            background: "#161B22",
            border: "#30363D",
            selected: "#388BFD",
          },
          edge: {
            DEFAULT: "#6E7681",
            active: "#58A6FF",
          },
          grid: "#161B22",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.25)",
        md: "0 4px 12px rgba(0,0,0,0.35)",
        lg: "0 8px 24px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
