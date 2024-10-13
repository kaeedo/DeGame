import { JSX } from "solid-js/jsx-runtime";

export type TextProps = {
  children: string | JSX.Element;
  x?: string | number;
  y?: string | number;
  className?: string;
} & JSX.TextSVGAttributes<SVGTextElement>;

// TODO Text is a separate component so that it could wrap the given text inside the surrounding hexagon
export function Text(props: TextProps) {
  return (
    <text
      x={props.x || 0}
      y={props.y ? props.y : "0.3em"}
      text-anchor="middle"
      {...props}
    >
      {props.children}
    </text>
  );
}

export default Text;
