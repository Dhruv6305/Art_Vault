import React from "react";

const ArtworkForm = ({ formData, categories, errors, onChange }) => {
  return (
    <div className="artwork-form">
      <h3>Artwork Details</h3>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`form-input ${errors.title ? "error" : ""}`}
          placeholder="Enter artwork title"
          maxLength="100"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          className={`form-textarea ${errors.description ? "error" : ""}`}
          placeholder="Describe your artwork, inspiration, techniques used..."
          rows="4"
          maxLength="2000"
        />
        <div className="char-count">{formData.description.length}/2000</div>
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            className={`form-select ${errors.category ? "error" : ""}`}
          >
            <option value="">Select category</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="field-error">{errors.category}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subcategory">Subcategory *</label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={onChange}
            className={`form-select ${errors.subcategory ? "error" : ""}`}
            disabled={!formData.category}
          >
            <option value="">Select subcategory</option>
            {formData.category &&
              categories[formData.category]?.subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
          {errors.subcategory && (
            <span className="field-error">{errors.subcategory}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="artworkType">Type *</label>
          <select
            id="artworkType"
            name="artworkType"
            value={formData.artworkType}
            onChange={onChange}
            className="form-select"
          >
            <option value="original">Original</option>
            <option value="print">Print</option>
            <option value="digital">Digital</option>
            <option value="nft">NFT</option>
            <option value="license">License</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="medium">Medium *</label>
          <input
            id="medium"
            type="text"
            name="medium"
            value={formData.medium}
            onChange={onChange}
            className={`form-input ${errors.medium ? "error" : ""}`}
            placeholder="e.g., Oil on canvas, Digital, Acrylic..."
          />
          {errors.medium && (
            <span className="field-error">{errors.medium}</span>
          )}
        </div>
      </div>

      {/* Dimensions - only show for physical artworks */}
      {formData.artworkType !== "digital" && formData.artworkType !== "nft" && (
        <div className="dimensions-section">
          <h4><label>DIMENSIONS</label></h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dimensions.width">Width</label>
              <input
                id="dimensions.width"
                type="number"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={onChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dimensions.height">Height</label>
              <input
                id="dimensions.height"
                type="number"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={onChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dimensions.depth">Depth</label>
              <input
                id="dimensions.depth"
                type="number"
                name="dimensions.depth"
                value={formData.dimensions.depth}
                onChange={onChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dimensions.unit">Unit</label>
              <select
                id="dimensions.unit"
                name="dimensions.unit"
                value={formData.dimensions.unit}
                onChange={onChange}
                className="form-select"
              >
                <option value="cm">cm</option>
                <option value="in">inches</option>
                <option value="mm">mm</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="yearCreated">Year Created</label>
          <input
            id="yearCreated"
            type="number"
            name="yearCreated"
            value={formData.yearCreated}
            onChange={onChange}
            className="form-input"
            placeholder="2024"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="style">Style</label>
          <input
            id="style"
            type="text"
            name="style"
            value={formData.style}
            onChange={onChange}
            className="form-input"
            placeholder="e.g., Abstract, Realistic, Modern..."
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="technique">Technique</label>
        <input
          id="technique"
          type="text"
          name="technique"
          value={formData.technique}
          onChange={onChange}
          className="form-input"
          placeholder="e.g., Brush painting, Digital illustration..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={onChange}
          className="form-input"
          placeholder="Enter tags separated by commas (e.g., abstract, colorful, modern)"
        />
        <div className="form-help">
          Use tags to help people discover your artwork
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
