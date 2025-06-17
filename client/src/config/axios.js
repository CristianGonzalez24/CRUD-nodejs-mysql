import axios from "axios";
import { ENV } from "./ENV.js";
import { handleError } from "../utils/errorHandler.js";

const instance = axios.create({
 baseURL: ENV.API_URL,
 withCredentials: true,
 timeout: 10000,
 headers: {
  "Content-Type": "application/json",
 },
});

instance.interceptors.response.use(
 (response) => response,
 (error) => {
  handleError(error, { logOnly: true });
  return Promise.reject(error);
 }
);

export default instance;
