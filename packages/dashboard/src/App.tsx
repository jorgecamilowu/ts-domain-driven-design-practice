import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Typography } from "./components/ui/typography";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Typography variant="h1">Dashboard</Typography>
      <Button onClick={() => setCount((prev) => prev + 1)}>
        Counter {count}
      </Button>
    </>
  );
}

export default App;
