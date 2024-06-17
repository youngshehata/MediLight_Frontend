import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Fallback from "./pages/Fallback/Fallback";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import { language as languageTexts } from "./language";
import NotFound from "./components/NotFound/NotFound";

export const LanguageContext = createContext(null);
export const AuthContxt = createContext(null);

function App() {
  // navigation
  const navigate = useNavigate();
  // check if this user has language in local storage
  const alreadyChoosedLanguage = localStorage.getItem("lang") || "en";
  const [language, setLanguage] = useState(alreadyChoosedLanguage);
  const [userInfo, setUserInfo] = useState(null);

  // this ref is used to get the app div element and give it the correct font (arabic | english)
  const appRef = useRef(null);

  const changeLanguage = (lang) => {
    //checking for only AR and EN - if more languages added later this gotta change
    if (lang !== "en" && lang !== "ar") {
      return toast.error(languageTexts.languageError[language]);
    }
    //checking if same language selected, then no need for state changing
    if (lang == language) {
      return;
    }
    //choosing font family
    if (lang == "ar") {
      appRef.current.classList.add("arFont");
      appRef.current.classList.remove("enFont");
    } else {
      appRef.current.classList.add("enFont");
      appRef.current.classList.remove("arFont");
    }
    // changing in local storage
    localStorage.setItem("lang", lang);
    // changing the state
    setLanguage(lang);
  };

  return (
    <div ref={appRef} className="app">
      <LanguageContext.Provider value={language}>
        <AuthContxt.Provider value={userInfo}>
          <ErrorBoundary fallback={<Fallback />}>
            <div>
              <Toaster />
            </div>
            <>
              <Routes>
                <Route
                  path="/"
                  element={<Homepage changeLanguage={changeLanguage} />}
                ></Route>
                {/* LAST ROUTE */}
                <Route path="/*" element={<NotFound />}></Route>
              </Routes>
            </>
          </ErrorBoundary>
        </AuthContxt.Provider>
      </LanguageContext.Provider>
    </div>
  );
}

export default App;
