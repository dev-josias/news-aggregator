/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
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
  const [initial, setInitial] = useState<{
    sources: number[];
    categories: number[];
    authors: number[];
  } | null>(null);
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
      setInitial(p);
    });
  }, []);

  const isDirty = useMemo(() => {
    if (!initial) return false;
    const same = (a: number[], b: number[]) =>
      a.length === b.length &&
      [...a].sort().every((v, i) => v === [...b].sort()[i]);
    return !(
      same(prefs.sources, initial.sources) &&
      same(prefs.categories, initial.categories) &&
      same(prefs.authors, initial.authors)
    );
  }, [prefs, initial]);

  const toggle = (k: "sources" | "categories" | "authors", id: number) =>
    setPrefs((p) => ({
      ...p,
      [k]: p[k].includes(id) ? p[k].filter((x) => x !== id) : [...p[k], id],
    }));

  const save = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await updatePreferences(prefs);
      setInitial(prefs);
    } finally {
      setSaving(false);
    }
  };

  // Optional helpers
  const selectAll = (
    k: "sources" | "categories" | "authors",
    allIds: number[]
  ) => setPrefs((p) => ({ ...p, [k]: allIds }));
  const clearAll = (k: "sources" | "categories" | "authors") =>
    setPrefs((p) => ({ ...p, [k]: [] }));

  return (
    <section className="articles-container" style={{ position: "relative" }}>
      <h2 className="section-title">Your Preferences</h2>

      {/* Quick actions row */}
      <div className="preferences-quick-actions">
        <button
          className="btn btn-secondary"
          onClick={() =>
            selectAll(
              "sources",
              sources.map((s) => s.id)
            )
          }
          disabled={!sources.length}
        >
          Select all sources
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => clearAll("sources")}
          disabled={!sources.length}
        >
          Clear sources
        </button>
        <button
          className="btn btn-secondary"
          onClick={() =>
            selectAll(
              "categories",
              categories.map((c) => c.id)
            )
          }
          disabled={!categories.length}
        >
          Select all categories
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => clearAll("categories")}
          disabled={!categories.length}
        >
          Clear categories
        </button>
        <button
          className="btn btn-secondary"
          onClick={() =>
            selectAll(
              "authors",
              authors.map((a) => a.id)
            )
          }
          disabled={!authors.length}
        >
          Select all authors
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => clearAll("authors")}
          disabled={!authors.length}
        >
          Clear authors
        </button>
      </div>

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

      {/* Bottom save button for larger screens */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          className="btn btn-primary"
          onClick={save}
          disabled={saving || !isDirty}
        >
          {saving ? "Saving..." : isDirty ? "Save Preferences" : "Saved"}
        </button>
      </div>

      {/* Floating Save FAB for mobile */}
      <button
        onClick={save}
        disabled={saving || !isDirty}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 50,
          padding: "12px 16px",
          borderRadius: 9999,
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          background:
            saving || !isDirty
              ? "#6B7280"
              : "linear-gradient(135deg, #e94560, #ff6b6b)",
          color: "white",
          border: "none",
          cursor: saving || !isDirty ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          opacity: saving ? 0.8 : 1,
          fontSize: "0.9rem",
          fontWeight: "500",
        }}
        aria-label="Save preferences"
        title={isDirty ? "Save preferences" : "All changes saved"}
        onMouseEnter={(e) => {
          if (!saving && isDirty) {
            const elt = e.target as HTMLElement;
            elt.style.transform = "translateY(-2px)";
            elt.style.boxShadow = "0 12px 25px rgba(0,0,0,0.2)";
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          const elt = e.target as HTMLElement;
          elt.style.transform = "translateY(0)";
          elt.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
        }}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </section>
  );
}
