import { createContext, useRef, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { Route, Routes } from "react-router-dom";
import Fallback from "./pages/Fallback/Fallback";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import { language as languageTexts } from "./language";
import NotFound from "./pages/NotFound/NotFound";
import Medilight from "./pages/Medilight/Medilight";

export const LanguageContext = createContext(null);
export const AuthContext = createContext(null);

function App() {
  // check if this user has language in local storage
  const alreadyChoosedLanguage = localStorage.getItem("lang") || "en";
  const [language, setLanguage] = useState(alreadyChoosedLanguage);
  const [userInfo, setUserInfo] = useState(true);

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

    localStorage.setItem("lang", lang);

    setLanguage(lang);
  };

  const changeAuth = (data) => {
    setUserInfo(data);
  };

  return (
    <div
      ref={appRef}
      className={alreadyChoosedLanguage == "ar" ? "app arFont" : "app enFont"}
    >
      <LanguageContext.Provider value={language}>
        <AuthContext.Provider value={userInfo}>
          <ErrorBoundary fallback={<Fallback />}>
            <div>
              <Toaster />
            </div>
            <>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Homepage
                      changeLanguage={changeLanguage}
                      changeAuth={changeAuth}
                    />
                  }
                ></Route>
                <Route
                  path="/medilight/*"
                  element={
                    <Medilight
                      changeLanguage={changeLanguage}
                      changeAuth={changeAuth}
                    />
                  }
                ></Route>
                {/* LAST ROUTE */}
                <Route path="/*" element={<NotFound />}></Route>
              </Routes>
            </>
          </ErrorBoundary>
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </div>
  );
}

export default App;
