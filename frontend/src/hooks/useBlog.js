import api from '../lib/api';

export const getBlogs = async (page = 1, limit = 10) => {
  const res = await api.get(`/blogs?page=${page}&limit=${limit}`);
  return res.data;
};

export const getBlog = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
};

export const createBlog = async (data) => {
  const res = await api.post('/blogs', data);
  return res.data;
};

export const updateBlog = async (id, data) => {
  const res = await api.put(`/blogs/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};