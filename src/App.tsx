import { useEffect, useMemo } from "react";
import "./App.css";
import { BuilderApi } from "./builder_api";

function App() {
  const api = useMemo(() => new BuilderApi({ rootElement: document.body }), []);

  useEffect(() => {
    api.init();

    const listener = () => api.resize();
    window.addEventListener("resize", listener);

    return () => {
      api.dispose();
      window.removeEventListener("resize", listener);
    };
  }, [api]);

  return <button onClick={() => api.addBuilding()}>+ Building</button>;
}

export default App;
