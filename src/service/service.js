import axios from "axios";
import {baseURL} from "../util/config";

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(
  (config) => {
    let headers = {};
    let token = sessionStorage.getItem("token");
    if (token)
      // if (config && config.url != "/api/v1/login") {
      headers["Authorization"] = `Bearer ${token}`;
    headers["Content-type"] = "application/json";
    config.headers = { ...headers, ...config.headers };
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response?.data || response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export const signUpUser = (username, password) => {
  return axiosInstance.post("/register", {
    username,
    password,
  });
};
export const loginUser = (username, password) => {
  return axiosInstance.post("/signin", {
    username,
    password,
  });
};

export const getCountryDetails = (name) => {
  let queryDetails = {
    query: ` query GetCountryDetails($name: String!) {
      countryDetails(name:$name) {
        name,
        official,
        region,
        population,
        currency{
          name,
          code,
          symbol,
          exchangeRate
        },
        baseCurrencyValue
      }
    }  `,
    variables: { name },
  };
  return axiosInstance.post("/exchange", JSON.stringify(queryDetails));
};

