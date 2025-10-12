import { addTokenToRequest } from '@/shared/utils/add-token-to-request';
import axios from 'axios';

const sompoApiWithoutToken = axios.create({
  baseURL: import.meta.env.VITE_SOMPO_API_URL,
});

const sompoApi = axios.create({
  baseURL: import.meta.env.VITE_SOMPO_API_URL,
});

addTokenToRequest(sompoApi);

export { sompoApiWithoutToken, sompoApi };
