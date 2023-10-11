import axios from "axios";

const jsonAPI = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

jsonAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      alert(
        typeof err.response?.data === "object"
          ? JSON.stringify(err.response?.data)
          : err.response?.data || err.response?.statusText || err.message
      );
      err.response.status === 501 && window.location.reload();
    } else console.error(err);

    return Promise.reject(err);
  }
);

export default jsonAPI;
