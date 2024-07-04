import {
  Suspense,
  createContext,
  lazy,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Fallback from "./pages/Fallback/Fallback";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import { language as languageTexts } from "./utilities/language";
import NotFound from "./pages/NotFound/NotFound";
import Loading from "./components/Loading/Loading";
import {
  decodeJWT,
  decodeJWT_Roles,
  initAuthentication,
} from "./utilities/auth";
import axios from "axios";
import { fetchFromApi } from "./api/fetcher";

const Medilight = lazy(() => import("./pages/Medilight/Medilight"));

export const LanguageContext = createContext(null);
export const AuthContext = createContext(null);
export const RolesContext = createContext(null);

function App() {
  // check if this user has language in local storage
  const alreadyChoosedLanguage = localStorage.getItem("lang") || "en";
  const [language, setLanguage] = useState(alreadyChoosedLanguage);
  const [userInfo, setUserInfo] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  // setting language headers
  axios.defaults.headers.common["Accept-Language"] =
    language == "ar" ? "ar-EG" : "en-US";

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

  initAuthentication();

  const changeAuth = (data, roles) => {
    setUserInfo(data);
    if (roles) {
      setUserRoles(["Medilight", ...roles]);
    }
  };

  const locationHook = useLocation();
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const myToken = sessionStorage.getItem("access");
    if (myToken) {
      fetchFromApi(
        `V1/Authentication/Validate-Token?AccessToken=${myToken}`,
        "GET"
      )
        .then(() => {
          const userInfoFromJWT = decodeJWT(myToken);
          const roles = decodeJWT_Roles(myToken);
          setUserInfo(userInfoFromJWT);
          setUserRoles(roles);
        })
        .catch(() => {
          if (locationHook.pathname == "/") {
            return;
          }
          toast.error(languageTexts.unauthorized[language]);
          return navigate("/");
        });
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div
      ref={appRef}
      className={alreadyChoosedLanguage == "ar" ? "app arFont" : "app enFont"}
    >
      <LanguageContext.Provider value={language}>
        <AuthContext.Provider value={userInfo}>
          <RolesContext.Provider value={userRoles}>
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
                      <Suspense fallback={<Loading />}>
                        <Medilight
                          changeLanguage={changeLanguage}
                          changeAuth={changeAuth}
                        />
                      </Suspense>
                    }
                  ></Route>

                  {/* LAST ROUTE */}
                  <Route path="/*" element={<NotFound />}></Route>
                </Routes>
              </>
            </ErrorBoundary>
          </RolesContext.Provider>
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </div>
  );
}

export default App;
