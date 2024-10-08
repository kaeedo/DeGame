/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { App } from "./App";

import { Display, RNG } from "rot-js";
import { DisplayOptions } from "rot-js/lib/display/types";

const o: Partial<DisplayOptions> = {
  width: 80,
  height: 50,
  layout: "hex",
};

const display = new Display(o);
const canvas = display.getContainer()!;

document.body.append(canvas);

for (var y = 0; y < 5; y++) {
  for (var x = y % 2; x < 8; x += 2) {
    var bg = RNG.getItem(["#333", "#666", "#999", "#ccc", "#fff"]);
    display.draw(x, y, "•", "#000", bg);
  }
}

const root = document.getElementById("root");

render(() => <App />, root!);
