import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Dashboard</h1>
      <Button onClick={() => setCount((prev) => prev + 1)}>
        Counter {count}
      </Button>
    </>
  );
}

export default App;
