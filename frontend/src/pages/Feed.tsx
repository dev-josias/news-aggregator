/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";

export default function Feed() {
  const [data, setData] = useState<any>({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/me/feed`, {
      headers: {
        Authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
      },
    })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="articles-container">
      <h2 className="section-title">My Feed</h2>
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
    </section>
  );
}
