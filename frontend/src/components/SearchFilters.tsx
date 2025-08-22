/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getSources, getCategories, getAuthors } from "../api/taxonomies";

type Props = {
  value: {
    q?: string;
    source?: number;
    category?: number;
    author?: number;
    from?: string;
    to?: string;
    sort?: string;
    page?: number;
  };
  onChange: (v: Props["value"]) => void;
};

export default function SearchFilters({ value, onChange }: Props) {
  const [sources, setSources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    getSources().then((res) => setSources(res?.data ?? []));
    getCategories().then((res) => setCategories(res?.data ?? []));
    getAuthors().then((res) => setAuthors(res?.data ?? []));
  }, []);

  const [qLocal, setQLocal] = useState(value.q ?? "");
  useEffect(() => {
    const id = setTimeout(
      () => onChange({ ...value, q: qLocal || undefined, page: 1 }),
      300
    );
    return () => clearTimeout(id);
  }, [qLocal, onChange, value]);

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search articles…"
            value={qLocal}
            onChange={(e) => setQLocal(e.target.value)}
          />
          <select
            className="filter-select"
            value={value.sort ?? "published_desc"}
            onChange={(e) =>
              onChange({ ...value, sort: e.target.value, page: 1 })
            }
          >
            <option value="published_desc">Newest</option>
            <option value="published_asc">Oldest</option>
          </select>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Source</label>
            <select
              className="filter-select"
              value={value.source ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  source: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">All</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={value.category ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  category: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Author</label>
            <select
              className="filter-select"
              value={value.author ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  author: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">All</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-select"
              value={value.from ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  from: e.target.value || undefined,
                  page: 1,
                })
              }
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-select"
              value={value.to ?? ""}
              onChange={(e) =>
                onChange({ ...value, to: e.target.value || undefined, page: 1 })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
