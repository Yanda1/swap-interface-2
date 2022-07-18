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
    logo: string;
    main: string;
  };
  state: {
    hover : {
      warning: string,
      error: string,
      info: string,
      main: string,
      secondary: string,
      pure: string,
      logo: string,
    },
    active: string;
    focus: string;
    disabled: string;
  };
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
    default: "white",
    info: "#6D6D6D",
    error: "#DE3434",
    warning: "#FD862F",
    logo: "#172631",
    main: "#00A8E8"
  },
  state: {
    hover : {
      warning: "#FFA665",
      error: "#FF4040",
      info: "#979797",
      main: "#37C8FF",
      secondary: "#00A8E8",
      pure: "#B4B4B4",
      logo: "#203646",
    },
    active: "#ff0223",
    focus: "currentColor",
    disabled: "#7c7f81",
  },
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
    default: "white",
    info: "#6D6D6D",
    error: "#DE3434",
    warning: "#FD862F",
    logo: "#172631",
    main: "#00A8E8"
  },
  state: {
    hover : {
      warning: "#FFA665",
      error: "#FF4040",
      info: "#979797",
      main: "#37C8FF",
      secondary: "#00A8E8",
      pure: "#B4B4B4",
      logo: "#203646",
    },
    active: "#ff0223",
    focus: "currentColor",
    disabled: "#7c7f81",
  },
};
