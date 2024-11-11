// src/api/userApi.js
import Books from '../interfaces/bookInterface';
import axiosInstance from './axiosInstance';

export const fetchBooks = async () => {
  const response = await axiosInstance.get('/books');
  return response.data;
};

export const addBook = async (newBook: { title: string; author: string; genre: string; publication_date: string; isbn: string; available: boolean; }) => {
    const response = await axiosInstance.post('/books', newBook);
    return response.data;
  };

export const fetchBookById = async (id: string) => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
  };

export const updateBook = async (id: string, updatedDetails: Partial<Books>) => {
  const response = await axiosInstance.put(`/books/${id}`, updatedDetails);
  return response.data;
};

export const deleteBook = async (id: string) => {    
    const response = await axiosInstance.delete(`/books/${id}`);
    return response.data;
  };
