export type Breakpoint = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

export const breakpoint: { [key in Breakpoint]: number } = {
  xxs: 0,
  xs: 480,
  s: 760,
  m: 1000,
  l: 1300,
  xl: 1760,
  xxl: 1920,
};

type BreakpointOrNumber = Breakpoint | number;

export const mediaQuery = (
  maxBreakpoint: BreakpointOrNumber,
  minBreakpoint?: BreakpointOrNumber
): string =>
  `${
    minBreakpoint
      ? `@media (min-width: ${
          typeof minBreakpoint !== "number" && breakpoint[minBreakpoint]
        }px) and `
      : ""
  }${!minBreakpoint ? "@media " : ""}(max-width: ${
    (typeof maxBreakpoint !== "number" && breakpoint[maxBreakpoint]) ||
    maxBreakpoint
  }px)`;
