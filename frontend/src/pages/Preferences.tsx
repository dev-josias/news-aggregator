/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getSources, getCategories, getAuthors } from "../api/taxonomies";
import { getPreferences, updatePreferences } from "../api/preferences";

export default function Preferences() {
  const [sources, setSources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<{
    sources: number[];
    categories: number[];
    authors: number[];
  }>({ sources: [], categories: [], authors: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getSources(),
      getCategories(),
      getAuthors(),
      getPreferences(),
    ]).then(([s, c, a, p]) => {
      setSources(s.data ?? s);
      setCategories(c.data ?? c);
      setAuthors(a.data ?? a);
      setPrefs(p);
    });
  }, []);

  const toggle = (k: "sources" | "categories" | "authors", id: number) =>
    setPrefs((p) => ({
      ...p,
      [k]: p[k].includes(id) ? p[k].filter((x) => x !== id) : [...p[k], id],
    }));

  const save = async () => {
    setSaving(true);
    await updatePreferences(prefs);
    setSaving(false);
  };

  return (
    <section className="articles-container">
      <h2 className="section-title">Your Preferences</h2>
      <div className="preferences-grid">
        <div className="preference-group">
          <h3 className="preference-title">Sources</h3>
          <div className="checkbox-group">
            {sources.map((s) => (
              <label key={s.id} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={prefs.sources.includes(s.id)}
                  onChange={() => toggle("sources", s.id)}
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="preference-group">
          <h3 className="preference-title">Categories</h3>
          <div className="checkbox-group">
            {categories.map((c) => (
              <label key={c.id} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={prefs.categories.includes(c.id)}
                  onChange={() => toggle("categories", c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="preference-group">
          <h3 className="preference-title">Authors</h3>
          <div className="checkbox-group">
            {authors.map((a) => (
              <label key={a.id} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={prefs.authors.includes(a.id)}
                  onChange={() => toggle("authors", a.id)}
                />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </section>
  );
}
