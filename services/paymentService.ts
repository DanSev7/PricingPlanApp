import axios, { AxiosError } from 'axios';
import env from '../config/environment';

// Base URL for our backend API
const API_BASE_URL = env.apiUrl;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Initialize a payment with the backend
 * @param paymentData - Payment information
 * @returns Promise with payment response
 */
export const initializePayment = async (paymentData: {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
}) => {
  try {
    const response = await apiClient.post('/payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment initialization error:', error); // Added logging
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        const data = axiosError.response.data as { error?: string };
        throw new Error(data.error || 'Failed to initialize payment');
      }
      // Handle network errors specifically
      if (error.code === 'NETWORK_ERROR') {
        throw new Error('Unable to connect to payment server. Please check your network connection.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

export default {
  initializePayment,
};