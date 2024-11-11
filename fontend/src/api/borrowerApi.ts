import Borrower from "../interfaces/BorrowersInterface";
import axiosInstance from "./axiosInstance";

export const fetchborrowers = async () => {
    const response = await axiosInstance.get('/borrowers');
    return response.data;
  };

  export const fetchborrowerById = async (id: string) => {
    const response = await axiosInstance.get(`/borrowers/${id}`);
    return response.data;
  };
  
  export const addborrower = async (newBorrower: Borrower) => {
    const response = await axiosInstance.post('/borrowers', newBorrower);
    return response.data;
  };
  
  export const updateborrower = async (id: string, selectedBorrower: Borrower) => {
    const response = await axiosInstance.put(`/borrowers/${id}`,selectedBorrower);
    return response.data;
  };
  
  export const deleteborrower = async (id: string) => {
    const response = await axiosInstance.delete(`/borrowers/${id}`);
    return response.data;
  };
  