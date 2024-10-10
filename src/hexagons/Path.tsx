import { JSX } from "solid-js/jsx-runtime";
import { HexUtils } from "./HexUtils";
import { Hex } from "./models/Hex";
import { useContext } from "solid-js";
import { Context } from "./Layout";

export type PathProps = {
  start: any;
  end?: any;
} & Omit<JSX.PathSVGAttributes<SVGPathElement>, "start" | "end">;

/**
 * Renders an svg `<path>` component with points on the grid between a qrs-based `start` and `end` coordinates.
 */
export function Path({ start, end, ...props }: PathProps) {
  const ctx = useContext(Context);

  // TODO Refactor
  function getPoints() {
    if (!start || !end) {
      return "";
    }

    // Get all the intersecting hexes between start and end points
    let distance = HexUtils.distance(start, end);
    let intersects: Hex[] = [];
    let step = 1.0 / Math.max(distance, 1);
    for (let i = 0; i <= distance; i++) {
      intersects.push(HexUtils.round(HexUtils.hexLerp(start, end, step * i)));
    }

    // Construct Path points out of all the intersecting hexes (e.g. M 0,0 L 10,20, L 30,20)
    let points = "M";
    points += intersects
      .map((hex) => {
        let p = HexUtils.hexToPixel(hex, ctx.layout);
        return ` ${p.x},${p.y} `;
      })
      .join("L");

    return points;
  }

  return <path {...props} d={getPoints()}></path>;
}

export default Path;
