import config from "config";
import { server } from "backend/infrastructure/server";

const port = parseInt(config.get("port")) || 8080;

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
