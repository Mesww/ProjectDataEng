// src/api/userApi.js
import axiosInstance from './axiosInstance';

export const fetchBooks = async () => {
  const response = await axiosInstance.get('/books');
  return response.data;
};

export const addBook = async () => {
    const response = await axiosInstance.post('/books');
    return response.data;
  };

export const fetchBookById = async (id: string) => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
  };

export const updateBook = async (id: string) => {
  const response = await axiosInstance.put(`/books/${id}`);
  return response.data;
};

export const deleteBook = async (id: string) => {    
    const response = await axiosInstance.delete(`/books/${id}`);
    return response.data;
  };
