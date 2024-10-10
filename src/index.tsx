/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { App } from "./App";
import { SVG } from "@svgdotjs/svg.js";
import { defineHex, Grid, Hex, rectangle } from "honeycomb-grid";

const hex = defineHex({ dimensions: 30, origin: "topLeft" });
const grid = new Grid(hex, rectangle({ width: 10, height: 10 }));

const draw = SVG().addTo("body").size("100%", "100%");

grid.forEach(renderSVG);

function renderSVG(hex: Hex) {
  const polygon = draw
    // create a polygon from a hex's corner points
    .polygon(hex.corners.map(({ x, y }) => `${x},${y}`) as any)
    .fill("none")
    .stroke({ width: 1, color: "#999" });

  return draw.group().add(polygon);
}

document.addEventListener("click", ({ offsetX, offsetY }) => {
  const hex = grid.pointToHex(
    { x: offsetX, y: offsetY },
    { allowOutside: false }
  );

  console.log(hex);
});

render(() => <App />, document.getElementById("root")!);
