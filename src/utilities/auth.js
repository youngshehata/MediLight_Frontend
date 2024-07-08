import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function initAuthentication() {
  let unAuthorizedAtteptDone = 0;

  async function refreshAccessToken() {
    try {
      const response = await axios.get("/v1/Authentication/Generate-Token");
      const token = response.data.data;
      // document.cookie = `access=${token}`;
      sessionStorage.setItem("access", token);
      //   const userInfoFromJWT = decodeJWT(token);
      //   setUserInfo(userInfoFromJWT);
      //   setIsLoading(false);
      return token;
    } catch (error) {
      //   setIsLoading(false);
      // document.cookie = `access=; Max-Age=0`;
      sessionStorage.removeItem("access");
      return (document.location.href = "/login");
    }
  }

  // use interceptors
  //----------------------------------
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        unAuthorizedAtteptDone.current < 5 // 5 attempts are enough
      ) {
        originalRequest._retry = true;

        unAuthorizedAtteptDone = unAuthorizedAtteptDone + 1;
        try {
          await refreshAccessToken(); // Your token refresh logic
          return axios(originalRequest); // Retry the request with the new token
        } catch (error) {
          // document.cookie = `access=; Max-Age=0`;
          sessionStorage.removeItem("access");
          return (document.location.href = "/login");
        }
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (config) => {
      // const accessToken = getCookie("access"); // Replace 'access' with your actual cookie name
      const accessToken = sessionStorage.getItem("access");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export const decodeJWT = (token) => {
  try {
    const decodedJWT = jwtDecode(token);
    let formatted = {
      username: decodedJWT.UserName,
      id: decodedJWT.Id,
    };
    return formatted;
  } catch (err) {
    return null;
  }
};
export const decodeJWT_Roles = (token) => {
  try {
    const decodedJWT = jwtDecode(token);
    // console.log(decodedJWT);
    return decodedJWT[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  } catch (err) {
    return null;
  }
};

export const authorizeURL = (url, rolesArray) => {
  if (rolesArray) {
    const rolesLowerCase = [...rolesArray].map((r) => {
      return r.toString().toLowerCase();
    });
    const authorized = rolesLowerCase.find((r) => {
      return r === url.toString().toLowerCase();
    });
    if (authorized) {
      return true;
    }
    return false;
  }
};

export const authorizeParam = (paramAsArray, rolesArray) => {
  // get rid of ids
  const paramsWithouIds = [...paramAsArray].map((p) => {
    if (!parseInt(p)) {
      return p;
    }
  });
  let convertedToString = paramsWithouIds.join("-");
  // add medilight to the start of string
  convertedToString = `medilight-${convertedToString}`;
  const isLastCharDash =
    convertedToString.charAt(convertedToString.length - 1) == "-"
      ? true
      : false;
  if (isLastCharDash) {
    convertedToString = convertedToString.slice(
      0,
      convertedToString.length - 1
    );
  }

  if (convertedToString == "medilight") {
    return true;
  }

  const authorized = rolesArray.find((role) => {
    return `medilight-${role.toString().toLowerCase()}` === convertedToString;
  });
  if (authorized) {
    return true;
  }
  return false;
};
