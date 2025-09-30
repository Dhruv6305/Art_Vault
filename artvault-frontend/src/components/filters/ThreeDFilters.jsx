import React, { useState } from 'react';

const ThreeDFilters = ({ onFiltersChange, className = '' }) => {
  const [filters, setFilters] = useState({
    format: '',
    subcategory: '',
    priceRange: '',
    polygonCount: '',
    hasAnimations: false,
    hasMaterials: false,
    sortBy: 'newest'
  });

  const formats = [
    { value: 'gltf', label: 'GLTF' },
    { value: 'glb', label: 'GLB' },
    { value: 'fbx', label: 'FBX' },
    { value: 'obj', label: 'OBJ' },
    { value: 'blend', label: 'Blender' },
    { value: 'dae', label: 'COLLADA' },
    { value: '3ds', label: '3DS' },
    { value: 'ply', label: 'PLY' },
    { value: 'stl', label: 'STL' },
    { value: 'x3d', label: 'X3D' },
    { value: 'ma', label: 'Maya ASCII' },
    { value: 'mb', label: 'Maya Binary' }
  ];

  const subcategories = [
    'Characters',
    'Environments',
    'Props',
    'Vehicles',
    'Architecture',
    'Abstract',
    'Game Assets',
    'Printable Models'
  ];

  const priceRanges = [
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-250', label: '$100 - $250' },
    { value: '250-500', label: '$250 - $500' },
    { value: '500+', label: '$500+' }
  ];

  const polygonRanges = [
    { value: '0-1000', label: 'Low Poly (< 1K)' },
    { value: '1000-10000', label: 'Medium Poly (1K - 10K)' },
    { value: '10000-50000', label: 'High Poly (10K - 50K)' },
    { value: '50000+', label: 'Ultra High Poly (50K+)' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'polygons-low', label: 'Polygon Count: Low to High' },
    { value: 'polygons-high', label: 'Polygon Count: High to Low' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      format: '',
      subcategory: '',
      priceRange: '',
      polygonCount: '',
      hasAnimations: false,
      hasMaterials: false,
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy') return false;
      return value && value !== '';
    }).length;
  };

  return (
    <div className={`threed-filters ${className}`}>
      <div className="filters-header">
        <h3>🎲 3D Model Filters</h3>
        {getActiveFilterCount() > 0 && (
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* File Format Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">📄</span>
            File Format
          </label>
          <select
            value={filters.format}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            className="filter-select"
          >
            <option value="">All Formats</option>
            {formats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">🏷️</span>
            Category
          </label>
          <select
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {subcategories.map(sub => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">💰</span>
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Price</option>
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Polygon Count Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">🔺</span>
            Polygon Count
          </label>
          <select
            value={filters.polygonCount}
            onChange={(e) => handleFilterChange('polygonCount', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Count</option>
            {polygonRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Filters */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">✨</span>
            Features
          </label>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.hasAnimations}
                onChange={(e) => handleFilterChange('hasAnimations', e.target.checked)}
              />
              <span className="checkbox-label">🎬 Has Animations</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.hasMaterials}
                onChange={(e) => handleFilterChange('hasMaterials', e.target.checked)}
              />
              <span className="checkbox-label">🎨 Has Materials</span>
            </label>
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">🔄</span>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="filter-tags">
            {filters.format && (
              <span className="filter-tag">
                Format: {formats.find(f => f.value === filters.format)?.label}
                <button onClick={() => handleFilterChange('format', '')}>×</button>
              </span>
            )}
            {filters.subcategory && (
              <span className="filter-tag">
                Category: {filters.subcategory}
                <button onClick={() => handleFilterChange('subcategory', '')}>×</button>
              </span>
            )}
            {filters.priceRange && (
              <span className="filter-tag">
                Price: {priceRanges.find(p => p.value === filters.priceRange)?.label}
                <button onClick={() => handleFilterChange('priceRange', '')}>×</button>
              </span>
            )}
            {filters.polygonCount && (
              <span className="filter-tag">
                Polygons: {polygonRanges.find(p => p.value === filters.polygonCount)?.label}
                <button onClick={() => handleFilterChange('polygonCount', '')}>×</button>
              </span>
            )}
            {filters.hasAnimations && (
              <span className="filter-tag">
                Has Animations
                <button onClick={() => handleFilterChange('hasAnimations', false)}>×</button>
              </span>
            )}
            {filters.hasMaterials && (
              <span className="filter-tag">
                Has Materials
                <button onClick={() => handleFilterChange('hasMaterials', false)}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDFilters;