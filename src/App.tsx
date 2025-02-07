import { useEffect } from "react";
import "./App.css";
import { renderScene } from "./sample_scene";

function App() {
  useEffect(renderScene, []);

  return null;
}

export default App;
