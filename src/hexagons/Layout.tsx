import { JSX } from "solid-js/jsx-runtime";
import { Orientation } from "./models/Orientation";
import { Point } from "./models/Point";
import { createContext } from "solid-js";

export type Size = { x: number; y: number };

export type LayoutDimension = {
  size: Size;
  orientation: Orientation;
  origin: Size;
  spacing: number;
};
export type LayoutContextProps = {
  layout: LayoutDimension;
  points: string;
};

const LAYOUT_FLAT = new Orientation(
  3.0 / 2.0,
  0.0,
  Math.sqrt(3.0) / 2.0,
  Math.sqrt(3.0),
  2.0 / 3.0,
  0.0,
  -1.0 / 3.0,
  Math.sqrt(3.0) / 3.0,
  0.0
);
const LAYOUT_POINTY = new Orientation(
  Math.sqrt(3.0),
  Math.sqrt(3.0) / 2.0,
  0.0,
  3.0 / 2.0,
  Math.sqrt(3.0) / 3.0,
  -1.0 / 3.0,
  0.0,
  2.0 / 3.0,
  0.5
);
const defaultSize = new Point(10, 10);
const defaultOrigin = new Point(0, 0);
const defaultSpacing = 1.0;

export const Context = createContext<LayoutContextProps>({
  layout: {
    size: defaultSize,
    orientation: LAYOUT_FLAT,
    origin: defaultOrigin,
    spacing: defaultSpacing,
  },
  points: "",
});
/**
 * Calculates the points for a hexagon given the size, angle, and center
 * @param circumradius Radius of the Hexagon
 * @param angle Angle offset for the hexagon in radians
 * @param center Central point for the heaxagon
 * @returns Array of 6 points
 */

function calculateCoordinates(
  circumradius: number,
  angle: number = 0,
  center: Point = new Point(0, 0)
) {
  const corners: Point[] = [];

  for (let i = 0; i < 6; i++) {
    const x = circumradius * Math.cos((2 * Math.PI * i) / 6 + angle);
    const y = circumradius * Math.sin((2 * Math.PI * i) / 6 + angle);
    const point = new Point(center.x + x, center.y + y);
    corners.push(point);
  }

  return corners;
}

export type LayoutProps = {
  children: JSX.Element;
  className?: string;
  flat?: boolean;
  origin?: any;
  /* defines scale */
  size?: Size;
  space?: number;
  spacing?: number;
};

/**
 * Provides LayoutContext for all descendands and renders child elements inside a <g> (Group) element
 */
export function Layout(props: LayoutProps) {
  const size = () => props.size ?? defaultSize;
  const flat = () => props.flat ?? true;
  const spacing = () => props.spacing ?? defaultSpacing;
  const origin = () => props.origin ?? defaultOrigin;

  const points = (): string => {
    return calculateCoordinates(size().x, flat() ? 0 : Math.PI / 6)
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  };

  const layout = (): LayoutDimension => {
    return {
      ...props,
      orientation: flat() ? LAYOUT_FLAT : LAYOUT_POINTY,
      size: size(),
      origin: origin(),
      spacing: spacing(),
    };
  };

  return (
    <Context.Provider
      value={{
        layout: layout(),
        points: points(),
      }}
    >
      <g class={props.className}>{props.children}</g>
    </Context.Provider>
  );
}

export default Layout;
