import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TRPCClientProvider } from "./backendCommunication/rpc/Provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TRPCClientProvider>
      <App />
    </TRPCClientProvider>
  </React.StrictMode>
);
