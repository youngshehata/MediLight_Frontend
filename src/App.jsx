import { createContext, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter } from "react-router-dom";
import Fallback from "./pages/Fallback/Fallback";
import { ErrorBoundary } from "react-error-boundary";

export const LanguageContext = createContext(null);
function App() {
  const [language, setLanguage] = useState("en");
  return (
    <BrowserRouter>
      <div className="app">
        <LanguageContext.Provider value={language}>
          <ErrorBoundary fallback={<Fallback />}>
            <Homepage />
          </ErrorBoundary>
        </LanguageContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
