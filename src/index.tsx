/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { App } from "./App";

import {
  GridGenerator,
  Hex,
  Hexagon,
  HexGrid,
  HexUtils,
  Layout,
  Path,
  Text,
} from "./hexagons";
import { createSignal } from "solid-js";
import { H } from "./hexagons/Hexagon/Hexagon";

const Grid = () => {
  const [hexagons, setHexagons] = createSignal<Hex[]>(
    GridGenerator.parallelogram(-2, 3, -2, 1)
  );

  const [path, setPath] = createSignal<{
    start: Hex | undefined;
    end: Hex | undefined;
  }>({
    start: undefined,
    end: undefined,
  });

  const onClick = (source: H) => {
    if (!path().start) {
      setPath({ start: source.state.hex, end: path().end });
    } else {
      setPath({ start: undefined, end: undefined });
    }
  };

  const onMouseEnter = (source: H) => {
    // Set the path's end on hover
    const targetHex = source.state.hex;

    // Color some hexagons
    const coloredHexas = hexagons().map((hex) => {
      hex.props = hex.props || {};
      // Highlight tiles that are next to the target (1 distance away)
      hex.props.className =
        HexUtils.distance(targetHex, hex) < 2 ? "active" : "";

      // If the tile is on same coordinate, add class specific to the coordinate name
      hex.props.className += targetHex.q === hex.q ? " q " : "";
      hex.props.className += targetHex.r === hex.r ? " r " : "";
      hex.props.className += targetHex.s === hex.s ? " s " : "";

      return hex;
    });

    setPath({ start: path().start, end: targetHex });
    setHexagons(coloredHexas);
  };

  return (
    <div>
      <h1>Basic example of HexGrid usage.</h1>
      <HexGrid width={1200} height={1000}>
        <Layout size={{ x: 7, y: 7 }}>
          {hexagons().map((hex) => (
            <Hexagon
              q={hex.q}
              r={hex.r}
              s={hex.s}
              className={hex.props ? hex.props.className : undefined}
              onMouseEnter={(_, h) => onMouseEnter(h)}
              onClick={(_, h) => onClick(h)}
            >
              {/* <Text>{HexUtils.getID(hex)}</Text> */}
            </Hexagon>
          ))}

          <Path start={path().start} end={path().end} />
        </Layout>
      </HexGrid>
    </div>
  );
};

render(
  () => (
    <>
      <App />
      <Grid />
    </>
  ),
  document.getElementById("root")!
);
