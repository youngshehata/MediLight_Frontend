import { createContext, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter } from "react-router-dom";
import Fallback from "./pages/Fallback/Fallback";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import { language as languageTexts } from "./language";

export const LanguageContext = createContext(null);
function App() {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    //temporary checking for only AR and EN
    if (lang !== "en" && lang !== "ar") {
      toast.error(languageTexts.languageError[language]);
    }
    setLanguage(lang);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <LanguageContext.Provider value={language}>
          <ErrorBoundary fallback={<Fallback />}>
            <div>
              <Toaster />
            </div>
            <Homepage changeLanguage={changeLanguage} />
          </ErrorBoundary>
        </LanguageContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
