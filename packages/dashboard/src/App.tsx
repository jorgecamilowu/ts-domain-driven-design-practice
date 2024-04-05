import "./App.css";
import { Typography } from "./components/ui/typography";
import { Tasks } from "./taskManagement/Tasks";

function App() {
  return (
    <>
      <section>
        <Typography variant="h1">Dashboard</Typography>
      </section>
      <section>
        <Tasks />
      </section>
    </>
  );
}

export default App;
