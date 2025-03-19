import axios from "axios";

// Cấu hình baseURL cho axios
const instance = axios.create({
  baseURL: "http://localhost:8080", // Địa chỉ của server Spring Boot
  withCredentials: true,  // Gửi cookie cùng với yêu cầu
});
instance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});
export default instance;
