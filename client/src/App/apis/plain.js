import axios from 'axios';

const plainAPI = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'text/plain',
    Accept: 'text/plain'
  }
});

plainAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      alert(
        typeof err.response?.data === 'object'
          ? JSON.stringify(err.response?.data)
          : err.response?.data || err.response?.statusText || err.message
      );
      err.response.status === 501 && window.location.reload();
    } else console.error(err);

    return Promise.reject(err);
  }
);

export default plainAPI;
