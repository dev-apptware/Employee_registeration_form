import axios from 'axios';
import type { InsertEmployee } from '@shared/schema';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const submitEmployeeData = async (data: InsertEmployee) => {
  try {
    const response = await axios.post(`${API_URL}/employees`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit form');
    }
    throw error;
  }
};
