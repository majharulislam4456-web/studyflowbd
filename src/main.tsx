import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./contexts/LanguageContext";
 import { PomodoroProvider } from "./contexts/PomodoroContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
     <PomodoroProvider>
       <App />
     </PomodoroProvider>
  </LanguageProvider>
);
