import axios from "axios";

const DEFAULT_API_URL = "http://localhost:3000/api/v1";

/** Axios instance for the DevMail REST API. Set VITE_API_URL to override the base URL. */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
});
