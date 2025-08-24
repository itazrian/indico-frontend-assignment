
import axios from "axios";
const API = "https://jsonplaceholder.typicode.com/users";

export const getUsers = async () => {
  const { data } = await axios.get(API);
  return data;
};

export const addUser = async (user) => {
  const { data } = await axios.post(API, user);
  return data;
};

export const updateUser = async ({ id, ...payload }) => {
  const { data } = await axios.put(`${API}/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`);
  return data;
};
