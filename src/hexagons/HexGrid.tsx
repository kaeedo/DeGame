import { JSX } from "solid-js/jsx-runtime";

type Props = {} & JSX.SvgSVGAttributes<SVGSVGElement>;

/**
 * Simple renders an `<svg>` container element for SVG graphics.
 * This component does not do anything special other than applying some defaults to the svg container if not provided.
 * The HexGrid should be used as the outer container for one or several `<Layouts>`.
 * @param {Props} SVGProps
 * @param {number} SVGProps.width - width of the SVG Container in px
 * @param {number} SVGProps.height - height of the SVG container in px
 * @param {string} SVGProps.viewBox - the container's internal coordinate system
 * @returns
 */
export function HexGrid(props: Props) {
  return (
    <svg
      class="grid"
      width={props.width ?? 800}
      height={props.height ?? 600}
      viewBox={props.viewBox ?? "-50 -50 100 100"}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  );
}
export default HexGrid;
