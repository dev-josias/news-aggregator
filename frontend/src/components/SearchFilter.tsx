import { useEffect, useState } from "react";
import { categories, sources } from "../data";

const SearchFilter = ({
  onSearch,
  onFilterChange,
}: {
  onSearch: (query: string) => void;
  onFilterChange: ({
    category,
    source,
    dateRange,
  }: {
    category: string;
    source: string;
    dateRange: string;
  }) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [dateRange, setDateRange] = useState("all");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      source: selectedSource,
      dateRange,
    });
  }, [selectedCategory, selectedSource, dateRange, onFilterChange]);

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for news, topics, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <div className="filter-tags">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`tag ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Source</label>
          <select
            className="filter-select"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          <select
            className="filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
