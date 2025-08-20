import { useState } from "react";
import { mockArticles } from "./data";
import type { Article } from "./types";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import PreferencesModal from "./components/PreferencesModal";
import SearchFilter from "./components/SearchFilter";
import ArticleCard from "./components/ArticleCard";
import StatsSection from "./components/StatsSection";
import Header from "./components/Header";
import Toast from "./components/Toast";
import AuthProvider from "./providers/AuthProvider";
import "./App.css";

const App = () => {
  const [currentView, setCurrentView] = useState("home");
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] =
    useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSearch = (searchTerm: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticles(filtered);
      setLoading(false);
    }, 500);
  };

  const handleFilterChange = (filters: {
    category: string;
    source: string;
  }) => {
    let filtered = [...articles];

    if (filters.category !== "All") {
      filtered = filtered.filter((a) => a.category === filters.category);
    }

    if (filters.source !== "All") {
      filtered = filtered.filter((a) => a.source === filters.source);
    }

    setFilteredArticles(filtered);
  };

  const handleBookmark = (articleId: number) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? { ...article, bookmarked: !article.bookmarked }
          : article
      )
    );
    setFilteredArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? { ...article, bookmarked: !article.bookmarked }
          : article
      )
    );

    const article = articles.find((a) => a.id === articleId);
    setToast({
      message: article?.bookmarked
        ? "Removed from bookmarks"
        : "Added to bookmarks",
      type: "success",
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case "login":
        return <LoginModal onClose={() => setCurrentView("home")} />;
      case "register":
        return <RegisterModal onClose={() => setCurrentView("home")} />;
      case "preferences":
        return <PreferencesModal onClose={() => setCurrentView("home")} />;
      case "bookmarks": {
        const bookmarkedArticles = articles.filter((a) => a.bookmarked);
        return (
          <>
            <div className="search-section">
              <SearchFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="articles-container">
              <h1 className="section-title">📚 Your Bookmarks</h1>
              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div className="articles-grid">
                  {bookmarkedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      }
      case "feed":
        return (
          <>
            <div className="search-section">
              <SearchFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="articles-container">
              <h1 className="section-title">🎯 Your Personalized Feed</h1>
              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div className="articles-grid">
                  {filteredArticles.slice(0, 4).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case "trending":
        return (
          <>
            <StatsSection />
            <div className="articles-container">
              <h1 className="section-title">🔥 Trending Now</h1>
              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div className="articles-grid">
                  {filteredArticles.slice(0, 6).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="search-section">
              <SearchFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
            </div>
            <StatsSection />
            <div className="articles-container">
              <h1 className="section-title">📰 Latest News</h1>
              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div className="articles-grid">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div>
        <Header onViewChange={setCurrentView} currentView={currentView} />
        {renderContent()}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
