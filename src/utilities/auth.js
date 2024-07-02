import axios from "axios";

export function initAuthentication() {
  const unAuthorizedAtteptDone = 0;

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
        console.log("Unauthorized");
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
