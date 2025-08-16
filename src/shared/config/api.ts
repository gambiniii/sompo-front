import { addTokenToRequest } from '@/shared/utils/add-token-to-request';
import axios from 'axios';

const sompoApiWithoutToken = axios.create({
  baseURL: import.meta.env.VITE_CAMADAS_API_URL,
});

const sompoApi = axios.create({
  baseURL: import.meta.env.VITE_CAMADAS_API_URL,
});

const ssoApi = axios.create({
  baseURL: import.meta.env.VITE_SSO_URL,
});

const passportApi = axios.create({
  baseURL: import.meta.env.VITE_PASSPORT_URL,
});

addTokenToRequest(sompoApi);

export { sompoApiWithoutToken, sompoApi, ssoApi, passportApi };
