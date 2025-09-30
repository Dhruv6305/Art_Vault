import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ArtworkCard from "../components/ui/ArtworkCard.jsx";
import ThreeDFilters from "../components/filters/ThreeDFilters.jsx";

const BrowseArtworks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const categories = {
    all: "All Categories",
    visual_art: "Visual Art",
    photography: "Photography",
    digital_art: "Digital Art",
    "3d_model": "3D Models",
    sculpture: "Sculpture",
    music: "Music",
    video: "Video",
    other: "Other",
  };

  const sortOptions = {
    createdAt: "Newest First",
    "price.amount": "Price: Low to High",
    "-price.amount": "Price: High to Low",
    views: "Most Viewed",
    title: "Title A-Z",
  };

  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== 1) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        ...filters,
        availability: "available",
      };

      // Remove empty values
      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key] === "all") {
          delete params[key];
        }
      });

      const response = await api.get("/artworks", { params });

      if (response.data.success) {
        setArtworks(response.data.artworks);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load artworks");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  return (
    <div className="browse-artworks-page">
      <div className="browse-header">
        <h1>Browse Artworks</h1>
        <p>Discover amazing art from talented artists around the world</p>
      </div>

      <div className="browse-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search artworks, artists, tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="form-select"
            >
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="price-input"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="price-input"
                min="0"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="form-select"
            >
              {Object.entries(sortOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="btn btn-secondary clear-filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="browse-content">
        {loading ? (
          <div className="loading-container">
            <span className="spinner"></span>
            <p>Loading artworks...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No artworks found</h3>
            <p>
              Try adjusting your search criteria or browse different categories.
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>
                Showing {artworks.length} of {pagination.total} artworks
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>

            <div className="artworks-grid">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="btn btn-secondary"
                >
                  ← Previous
                </button>

                <div className="page-numbers">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = Math.max(1, pagination.current - 2) + i;
                      if (pageNum > pagination.pages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`page-btn ${
                            pageNum === pagination.current ? "active" : ""
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="btn btn-secondary"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseArtworks;
