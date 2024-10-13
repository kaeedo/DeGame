import { Hex } from "../models/Hex";
import { HexUtils } from "../HexUtils";
import { JSX } from "solid-js/jsx-runtime";
import { useContext } from "solid-js";
import { Context } from "../Layout";

export type H = { data?: any; state: { hex: Hex }; props: HexagonProps };

export type HexagonMouseEventHandler = (event: MouseEvent, h: H) => void;

export type HexagonProps = {
  key?: number;
  q: number;
  r: number;
  s: number;
  fill?: string;
  className?: string;
  cellStyle?: string | JSX.CSSProperties | undefined;
  data?: any;
  onMouseEnter?: HexagonMouseEventHandler;
  onMouseLeave?: HexagonMouseEventHandler;
  onClick?: HexagonMouseEventHandler;
  onMouseOver?: HexagonMouseEventHandler;
  children?: JSX.Element;
};

/**
 * Renders a Hexagon cell at the given rqs-based coordinates.
 */
export function Hexagon(
  props: HexagonProps &
    Omit<
      JSX.GSVGAttributes<SVGGElement>,
      "transform" | "onMouseEnter" | "onClick" | "onMouseOver" | "onMouseLeave"
    >
) {
  const ctx = useContext(Context);

  const hexPixel = () => {
    const hex = new Hex(props.q, props.r, props.s);
    const pixel = HexUtils.hexToPixel(hex, ctx.layout);
    return {
      hex,
      pixel,
    };
  };

  return (
    <g
      class={`shape-group ${props.className ? props.className : ""}`}
      transform={`translate(${hexPixel().pixel.x}, ${hexPixel().pixel.y})`}
      {...props}
      onMouseEnter={(e) => {
        if (props.onMouseEnter) {
          props.onMouseEnter(e, { data: props.data, state: hexPixel(), props });
        }
      }}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e, { data: props.data, state: hexPixel(), props });
        }
      }}
      onMouseOver={(e) => {
        if (props.onMouseOver) {
          props.onMouseOver(e, { data: props.data, state: hexPixel(), props });
        }
      }}
      onMouseLeave={(e) => {
        if (props.onMouseLeave) {
          props.onMouseLeave(e, { data: props.data, state: hexPixel(), props });
        }
      }}
    >
      <g class="hexagon">
        <polygon
          points={ctx.points}
          fill={props.fill ? `url(#${props.fill})` : undefined}
          style={props.cellStyle}
        />
        {props.children}
      </g>
    </g>
  );
}

export default Hexagon;
