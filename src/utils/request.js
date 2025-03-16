import axios from "axios";
import { getToken } from "@/utils/storage.js";
const URL_API = "https://92dd-240e-47d-1afa-318d-15ea-f5a1-d926-5559.ngrok-free.app/api/news-manage-sys-api/v1.0";
const request = axios.create({
  baseURL: URL_API,
  timeout: 8000
});
request.interceptors.request.use(
  config => {
    const token = getToken();
    if (token !== null) {
      config.headers["token"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
export default request;
