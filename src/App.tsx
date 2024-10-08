import { createSignal, onCleanup } from "solid-js";

export function App() {
  const [count, setCount] = createSignal<number>(0);

  const interval = setInterval(() => setCount((c) => c + 1), 1000);

  onCleanup(() => clearInterval(interval));

  return (
    <>
      <div class="text-slate-950">Count: {count()}</div>
    </>
  );
}
