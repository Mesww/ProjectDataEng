import axiosInstance from "./axiosInstance";



export const fetchTransactions = async () => {
    const response = await axiosInstance.get('/transactions');
    return response.data;
  };
  
  export const fetchTransactionById = async (id: string) => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  };
  
  export const addTransaction = async () => {
    const response = await axiosInstance.post('/transactions');
    return response.data;
  };
  
  export const updateTransaction = async (id: string) => {
    const response = await axiosInstance.put(`/transactions/${id}`);
    return response.data;
  };
  
  export const deleteTransaction = async (id: string) => {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
  };
  
