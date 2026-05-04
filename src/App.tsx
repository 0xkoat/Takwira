import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Login } from "./Login";

const App = () => {
  return (
    <StrictMode>
      <div>
        <Login />
      </div>
    </StrictMode>
  );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
