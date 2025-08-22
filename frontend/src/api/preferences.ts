import { api } from "./client";
export const getPreferences = async () =>
  (await api.get("/me/preferences")).data;
export const updatePreferences = async (payload: {
  sources: number[];
  categories: number[];
  authors: number[];
}) => api.put("/me/preferences", payload);
