import Axios from 'axios';
import { AxiosInstance } from 'axios';

export const httpClient: AxiosInstance = Axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((requestConfig) => {
  const newConfig = { ...requestConfig };
  const user_config = localStorage.getItem('user_bs');
  let token = '';

  if (!user_config) {
    return unauthorized();
  }

  const { jwt_token } = JSON.parse(user_config);

  if (!jwt_token) {
    return unauthorized();
  }

  token = jwt_token;
  newConfig.headers.Authorization = `Bearer ${token}`;
  return newConfig;
});

httpClient.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      window.location.href = '/';
      return unauthorized();
    }
    if (response.status === 400) {
      return Promise.reject(response);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

function unauthorized() {
  localStorage.removeItem('user_bs');
  return Promise.reject({
    response: { status: 401, message: 'Unauthorized' },
  });
}
