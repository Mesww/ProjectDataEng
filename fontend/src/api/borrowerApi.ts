import axiosInstance from "./axiosInstance";

export const fetchborrowers = async () => {
    const response = await axiosInstance.get('/borrowers');
    return response.data;
  };

  export const fetchborrowerById = async (id: string) => {
    const response = await axiosInstance.get(`/borrowers/${id}`);
    return response.data;
  };
  
  export const addborrower = async () => {
    const response = await axiosInstance.post('/borrowers');
    return response.data;
  };
  
  export const updateborrower = async (id: string) => {
    const response = await axiosInstance.put(`/borrowers/${id}`);
    return response.data;
  };
  
  export const deleteborrower = async (id: string) => {
    const response = await axiosInstance.delete(`/borrowers/${id}`);
    return response.data;
  };
  