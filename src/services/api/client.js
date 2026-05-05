import axios from 'axios';
import { STRAPI_BASE_URL } from '../../config';

const apiClient = axios.create({
  baseURL: STRAPI_BASE_URL,
  timeout: 15000, // 15 seconds
});

export default apiClient;
