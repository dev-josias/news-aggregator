import { api } from "./client";
export const getSources = async () => (await api.get("/sources")).data;
export const getCategories = async () => (await api.get("/categories")).data;
export const getAuthors = async () => (await api.get("/authors")).data;
