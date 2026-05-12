import axios from 'axios';
import { STRAPI_BASE_URL } from '../../config';

const apiClient = axios.create({
  baseURL: STRAPI_BASE_URL,
  timeout: 120000, // 2 minute
});

export default apiClient;
