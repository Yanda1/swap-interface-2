export type Theme = "light" | "dark";

export type Colors = {
  // brand: string;
  name: Theme;
  default: string;
  background: {
    default: string;
    //   surface: string;
    //   shading: string;
  };
  // neutralContrast: {
  //   high: string;
  //   medium: string;
  //   low: string;
  // };
  // notification: {
  //   success: string;
  //   successSoft: string;
  //   warning: string;
  //   warningSoft: string;
  //   error: string;
  //   errorSoft: string;
  //   neutral: string;
  //   neutralSoft: string;
  // };
  // state: {
  //   hover: string;
  //   active: string;
  //   focus: string;
  //   disabled: string;
  // };
};

export const lightTheme: Colors = {
  // brand: "#d5001c",
  name: "light",
  default: "#5A5A5A",
  background: {
    default: "#FFF",
    // surface: "#f2f2f2",
    // shading: "rgba(14, 20, 24, 0.9)",
  },
  // neutralContrast: {
  //   high: "#323639",
  //   medium: "#626669",
  //   low: "#e3e4e5",
  // },
  // notification: {
  //   success: "#018a16",
  //   successSoft: "#e5f3e7",
  //   warning: "#ff9b00",
  //   warningSoft: "#fff5e5",
  //   error: "#e00000",
  //   errorSoft: "#fae6e6",
  //   neutral: "#0061bd",
  //   neutralSoft: "#e5eff8",
  // },
  // state: {
  //   hover: "#d5001c",
  //   active: "#d5001c",
  //   focus: "currentColor",
  //   disabled: "#96989a",
  // },
};

export const darkTheme: Colors = {
  // brand: "#d5001c",
  name: "dark",
  default: "#8C8D8F",
  background: {
    default: "#161B20",
    // surface: "#262b2e",
    // shading: "rgba(14, 20, 24, 0.9)",
  },
  // neutralContrast: {
  //   high: "#e3e4e5",
  //   medium: "#b0b1b2",
  //   low: "#4a4e51",
  // },
  // notification: {
  //   success: "#01ba1d",
  //   successSoft: "#bfeec6",
  //   warning: "#ff9b00",
  //   warningSoft: "#ffe6bf",
  //   error: "#fc1717",
  //   errorSoft: "#fec5c5",
  //   neutral: "#2193ff",
  //   neutralSoft: "#c7e4ff",
  // },
  // state: {
  //   hover: "#ff0223",
  //   active: "#ff0223",
  //   focus: "currentColor",
  //   disabled: "#7c7f81",
  // },
};
