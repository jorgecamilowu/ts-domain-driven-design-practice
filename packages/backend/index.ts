import config from "config";
import { server } from "./infrastructure/server";

const port = Number.parseInt(config.get("port")) || 8080;

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
