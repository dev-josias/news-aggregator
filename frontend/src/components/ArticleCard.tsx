import type { Article } from "../types";

const ArticleCard = ({
  article,
  onBookmark,
}: {
  article: Article;
  onBookmark: (id: number) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="article-card">
      <div className="article-image">
        <img src={article.imageUrl} alt={article.title} />
        <span className="article-badge">{article.category}</span>
      </div>
      <div className="article-content">
        <div className="article-meta">
          <div className="article-source">
            <div className="source-icon"></div>
            <span>{article.source}</span>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-description">{article.description}</p>
        <div className="article-footer">
          <span className="article-author">By {article.author}</span>
          <div className="article-actions">
            <button
              className={`action-btn ${article.bookmarked ? "active" : ""}`}
              onClick={() => onBookmark(article.id)}
            >
              {article.bookmarked ? "❤️" : "🤍"}
            </button>
            <button className="action-btn">📤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
