import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost/cdtt_backend/public/api/",
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
