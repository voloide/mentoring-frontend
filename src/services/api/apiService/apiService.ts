import axios from 'axios';
// import { Notify } from 'quasar';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  responseType: 'json',
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

// Função para fazer o logout
function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('tokenExpiration');
  window.location.reload();
}

// Função para iniciar o temporizador
function fixNextTokenExpirationTime() {
  localStorage.setItem('tokenExpiration', String(Date.now() + 900000));
}

// Request interceptor for API calls
instance.interceptors.request.use(
  (request) => {
    const userloged = localStorage.getItem('userInfo');
    request.headers = {
      Accept: 'application/json',
    };
    if (request.url === '/auth/refresh') {
      delete request.headers.Authorization;
    } else if (userloged != null && userloged != 'null') {
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const currentTime = Date.now();

      if (tokenExpiration && currentTime < Number(tokenExpiration)) {
        // O token ainda é válido, reiniciar o temporizador
        fixNextTokenExpirationTime();
      } else {
        // O token expirou, fazer o logout
        localStorage.setItem('tokenExpiration', '0');
        logout();
        return; // Interromper a solicitação
      }
      const authToken = localStorage.getItem('access_token');
      request.headers.Authorization = `Bearer ${authToken}`;
    } else {
      delete request.headers.Authorization;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default () => {
  return instance;
};
