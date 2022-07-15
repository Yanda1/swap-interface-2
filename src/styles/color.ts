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
  notification: {
    default: string;
    info: string
    error: string;
    warning: string;
    main: string;
  };
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
  notification: {
    default: "blue",
    info: "gray",
    error: "red",
    warning: "orange",
    main: "#00A8E8"
  },
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
  notification: {
    default: "blue",
    info: "gray",
    error: "red",
    warning: "orange",
    main: "#00A8E8"
  },
  // state: {
  //   hover: "#ff0223",
  //   active: "#ff0223",
  //   focus: "currentColor",
  //   disabled: "#7c7f81",
  // },
};
