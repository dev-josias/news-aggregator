/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { listArticles } from "../api/articles";
import SearchFilters from "../components/SearchFilters";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const [filters, setFilters] = useState({
    sort: "published_desc",
    page: 1,
    pageSize: 20,
  } as any);
  const [data, setData] = useState<any>({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listArticles(filters)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return (
    <>
      <SearchFilters value={filters} onChange={setFilters} />
      <section className="articles-container">
        <h2 className="section-title">Latest Articles</h2>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="articles-grid">
            {data.data?.map((a: any) => (
              <ArticleCard key={a.id} a={a} />
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <button
            className="btn btn-secondary"
            disabled={(data.meta?.current_page ?? 1) <= 1}
            onClick={() =>
              setFilters((f: any) => ({
                ...f,
                page: data.meta.current_page - 1,
              }))
            }
          >
            Prev
          </button>
          <button
            className="btn btn-primary"
            disabled={
              (data.meta?.current_page ?? 1) >= (data.meta?.last_page ?? 1)
            }
            onClick={() =>
              setFilters((f: any) => ({
                ...f,
                page: data.meta.current_page + 1,
              }))
            }
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}
