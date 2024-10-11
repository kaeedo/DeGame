/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { App } from "./App";

import { GridGenerator, Hexagon, HexGrid, Layout } from "./hexagons";

const hexagons = GridGenerator.parallelogram(-2, 3, -2, 1);

const Grid = () => (
  <div>
    <h1>Basic example of HexGrid usage.</h1>
    <HexGrid width={1200} height={1000}>
      <Layout size={{ x: 7, y: 7 }}>
        {hexagons.map((hex, i) => (
          <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} />
        ))}
      </Layout>
    </HexGrid>
  </div>
);

render(
  () => (
    <>
      <App />
      <Grid />
    </>
  ),
  document.getElementById("root")!
);
