/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ArticleCard({ a }: { a: any }) {
  return (
    <article
      className="article-card"
      onClick={() => window.open(a.url, "_blank")}
    >
      <div className="article-image">
        {a.image_url ? <img src={a.image_url} alt={a.title} /> : null}
        {a.category?.name && (
          <span className="article-badge">{a.category.name}</span>
        )}
      </div>

      <div className="article-content">
        <div className="article-meta">
          <div className="article-source">
            <div className="source-icon" />
            <span>{a.source?.name ?? "Source"}</span>
          </div>
          <time>
            {a.published_at
              ? new Date(a.published_at).toLocaleDateString()
              : ""}
          </time>
        </div>

        <h3 className="article-title" style={{ WebkitLineClamp: 2 }}>
          {a.title}
        </h3>
        {a.excerpt && (
          <p className="article-description" style={{ WebkitLineClamp: 3 }}>
            {a.excerpt}
          </p>
        )}

        <div className="article-footer">
          <span className="article-author">{a.author?.name ?? ""}</span>
          <div className="article-actions">
            <button className="action-btn" title="Open">
              🔗
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
