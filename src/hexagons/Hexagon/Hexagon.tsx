import { Hex } from "../models/Hex";
import { HexUtils } from "../HexUtils";
import { useLayoutContext } from "../Layout";
import { Point } from "../models/Point";
import { JSX } from "solid-js/jsx-runtime";
import { createMemo } from "solid-js";

type H = { data?: any; state: { hex: Hex }; props: HexagonProps };

export type HexagonDragEventHandler<AdditionalData = any> = (
  event: DragEvent,
  h: H,
  additionalData?: AdditionalData
) => void;

export type HexagonDragDropEventHandler<AdditionalData = any> = (
  event: DragEvent,
  h: H,
  additionalData: AdditionalData
) => void;

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
  onDragStart?: HexagonDragEventHandler;
  onDragEnd?: HexagonDragEventHandler;
  onDragOver?: HexagonDragEventHandler;
  onDrop?: HexagonDragDropEventHandler<TargetProps>;
  onMouseOver?: HexagonMouseEventHandler;
  children?: JSX.Element;
};

type TargetProps = {
  hex: Hex;
  pixel: Point;
  data?: any;
  fill?: string;
  class?: string;
};

/**
 * Renders a Hexagon cell at the given rqs-based coordinates.
 */
export function Hexagon(
  props: HexagonProps &
    Omit<
      JSX.GSVGAttributes<SVGGElement>,
      | "transform"
      | "onDragStart"
      | "onDragEnd"
      | "onDrop"
      | "onDragOver"
      | "onMouseEnter"
      | "onClick"
      | "onMouseOver"
      | "onMouseLeave"
    >
) {
  // destructure props into their values
  const {
    q,
    r,
    s,
    fill,
    cellStyle,
    className,
    children,
    onDragStart,
    onDragEnd,
    onDrop,
    onDragOver,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    onClick,
    data,
    "fill-opacity": fillOpacity,
    ...rest
  } = props;

  const { layout, points } = useLayoutContext();

  const hexPixel = createMemo(() => {
    const hex = new Hex(q, r, s);
    const pixel = HexUtils.hexToPixel(hex, layout);
    return {
      hex,
      pixel,
    };
  }, [q, r, s, layout]);

  const fillId = fill ? `url(#${fill})` : undefined;
  const draggable = { draggable: true } as any;
  return (
    <g
      class={`shape-group ${className ? className : ""}`}
      transform={`translate(${hexPixel().pixel.x}, ${hexPixel().pixel.y})`}
      {...rest}
      {...draggable}
      onDragStart={(e) => {
        if (onDragStart) {
          const targetProps: TargetProps = {
            hex: hexPixel().hex,
            pixel: hexPixel().pixel,
            data: data,
            fill: fill,
            class: className,
          };
          e.dataTransfer?.setData("hexagon", JSON.stringify(targetProps));
          onDragStart(e, { data, state: hexPixel(), props });
        }
      }}
      onDragEnd={(e) => {
        if (onDragEnd) {
          e.preventDefault();
          const success = e.dataTransfer?.dropEffect !== "none";
          onDragEnd(e, { state: hexPixel(), props }, success);
        }
      }}
      onDrop={(e) => {
        if (onDrop) {
          e.preventDefault();
          const target = JSON.parse(e.dataTransfer?.getData("hexagon") || "");
          onDrop(e, { data, state: hexPixel(), props }, target);
        }
      }}
      onDragOver={(e) => {
        if (onDragOver) {
          onDragOver(e, { data, state: hexPixel(), props });
        }
      }}
      onMouseEnter={(e) => {
        if (onMouseEnter) {
          onMouseEnter(e, { data, state: hexPixel(), props });
        }
      }}
      onClick={(e) => {
        if (onClick) {
          onClick(e, { data, state: hexPixel(), props });
        }
      }}
      onMouseOver={(e) => {
        if (onMouseOver) {
          onMouseOver(e, { data, state: hexPixel(), props });
        }
      }}
      onMouseLeave={(e) => {
        if (onMouseLeave) {
          onMouseLeave(e, { data, state: hexPixel(), props });
        }
      }}
    >
      <g class="hexagon">
        <polygon points={points} fill={fillId} style={cellStyle} />
        {children}
      </g>
    </g>
  );
}

export default Hexagon;
