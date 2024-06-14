import { createContext, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter } from "react-router-dom";

export const LanguageContext = createContext(null);
function App() {
  const [language, setLanguage] = useState("en");
  return (
    <BrowserRouter>
      <div className="app">
        <LanguageContext.Provider value={language}>
          <Homepage />
        </LanguageContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
