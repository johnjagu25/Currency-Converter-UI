import axios from "axios";
import { LOC_STORAGE, PRIVATE_KEY } from "../constant/constant";
import { baseURL } from "../util/config";
import CryptoAES from 'crypto-js/aes';


let source = null;

const axiosInstance = axios.create({ baseURL });
axiosInstance.interceptors.request.use(
  (config) => {
    let headers = {};
    let token = sessionStorage.getItem(LOC_STORAGE.TOKEN);
    if (token) headers["Authorization"] = `Bearer ${token}`;
    headers["Content-type"] = "application/json";
    config.headers = { ...headers, ...config.headers };
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response?.data || response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export const loginUser = (username, password) => {
  const payload = CryptoAES.encrypt(`${username}:${password}`, PRIVATE_KEY).toString();
  return axiosInstance.post("/signin", {
    payload,
  });
};

export const signUpUser = (username, password) => {
  const payload = CryptoAES.encrypt(`${username}:${password}`, PRIVATE_KEY).toString();
  return axiosInstance.post("/register", {
    payload,
  });
};

export const getCountryDetails = (name) => {
  source && source.cancel("cancel");
  source = axios.CancelToken.source();
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
  return axiosInstance.post("/exchange", JSON.stringify(queryDetails), {
    cancelToken: source.token,
  });
};
