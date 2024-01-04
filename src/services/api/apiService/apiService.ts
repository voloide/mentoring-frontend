import axios, { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { plainToClass, classToPlainFromExist } from 'class-transformer';
import UsersService from 'src/services/UsersService';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';
import { LocalStorage } from 'quasar';
import useNotify from 'src/composables/shared/notify/useNotify';
// import { Notify } from 'quasar';

const { website } = useSystemUtils();
const { notifyError } = useNotify()


const instance = axios.create({
  // baseURL: website.value
   // ? process.env.API_URL
   // : LocalStorage.getItem('backend_url'),

    baseURL: LocalStorage.getItem('backend_url'),
    responseType: 'json',
    validateStatus(status) {
      return [200].includes(status)
    },
});
const numTries = 0;

// Função para fazer o logout
function logout () {
  localStorage.removeItem('authUser');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('password');
  // localStorage.removeItem('tokenExpiration');
  window.location.reload();
}

// Função para iniciar o temporizador
function fixNextTokenExpirationTime() {
  // localStorage.setItem('tokenExpiration', String(Date.now() + 1200000)); // 20 minutos sem request
  // localStorage.setItem('tokenExpiration', String(Date.now() + 30000)); // 30 segundos sem request para teste
}

export async function request<T>(config: AxiosRequestConfig, Model: any): Promise<T> {
  const response = await instance.request<T>(config);
  return plainToClass<T, AxiosResponse['data']>(Model, response.data);
}

// Request interceptor for API calls
instance.interceptors.request.use(
  (request) => {
    const userloged = localStorage.getItem('user');
    request.headers = {
      Accept: 'application/json',
    };
    if (
      request.url === '/province' ||
      request.url === '/district' ||
      request.url.includes('/clinic/district') ||
      request.url === '/systemConfigs' ||
      request.url === '/menu' ||
      request.url.includes('/clinic/uuid')
    ) {
      delete request.headers.Authorization;
    } else if (userloged != null && userloged != 'null') {
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const currentTime = Date.now();

      if (tokenExpiration && currentTime < Number(tokenExpiration)) {
        // O token ainda é válido, reiniciar o temporizador
        // fixNextTokenExpirationTime();
      } else {
        // O token expirou, fazer o logout
        // localStorage.setItem('tokenExpiration', 0);
        // logout();
        // return; // Interromper a solicitação
      }
      const localuser = UsersService.getUserByUserName(String(userloged));
      request.headers['X-Auth-Token'] = ['', localuser.access_token].join(' ');
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
