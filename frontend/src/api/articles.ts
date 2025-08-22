import { api } from "./client";
export type ListFilters = {
  q?: string;
  from?: string;
  to?: string;
  category?: number;
  source?: number;
  author?: number;
  sort?: "published_desc" | "published_asc";
  page?: number;
  pageSize?: number;
};

export async function listArticles(filters: ListFilters) {
  const { data } = await api.get("/articles", { params: filters });
  return data;
}
