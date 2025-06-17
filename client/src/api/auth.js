import axios from "../config/axios";

export const loginRequest = (data) => axios.post("/auth/login", data);
export const registerRequest = (data) => axios.post("/auth/register", data);
export const logoutRequest = () => axios.post("/auth/logout");
export const refreshTokenRequest = () => axios.post("/auth/refresh");
export const hasRefreshTokenRequest = () => axios.get("/auth/has-refresh-token");
export const getUserRequest = (token) => axios.get("/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export const uploadImageRequest = (id, data, token) => axios.post(`/auth/${id}/upload-image`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
});
export const deleteImageRequest = (id, token) => axios.delete(`/auth/${id}/remove-image`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});