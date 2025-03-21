import axios from "axios";

// Cấu hình baseURL cho axios
const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Interceptor cho request
instance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

// Interceptor cho response để xử lý lỗi 403 toàn cục
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      error.customMessage = "Bạn không có quyền thực hiện hành động này";
    }
    return Promise.reject(error);
  }
);

export default instance;