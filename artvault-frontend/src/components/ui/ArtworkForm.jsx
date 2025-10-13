const ArtworkForm = ({ formData, categories, errors, onChange }) => {
  return (
    <div className="super-artwork-form">
      <div className="form-header">
        <div className="form-header-icon">🎨</div>
        <div className="form-header-content">
          <h3>Artwork Details</h3>
          <p>Tell us about your amazing creation</p>
        </div>
      </div>

      <div className="super-form-section">
        <div className="section-header">
          <span className="section-icon">✨</span>
          <h4>Basic Information</h4>
        </div>

        <div className="super-form-group">
          <label htmlFor="title" className="super-label">
            <span className="label-text">Title</span>
            <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className={`super-form-input ${errors.title ? "error" : ""}`}
              placeholder="Give your artwork a captivating title..."
              maxLength="100"
            />
            <div className="input-icon">🏷️</div>
          </div>
          {errors.title && <span className="super-field-error">{errors.title}</span>}
          <div className="char-counter">{formData.title.length}/100</div>
        </div>

        <div className="super-form-group">
          <label htmlFor="description" className="super-label">
            <span className="label-text">Description</span>
            <span className="required-star">*</span>
          </label>
          <div className="textarea-wrapper">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              className={`super-form-textarea ${errors.description ? "error" : ""}`}
              placeholder="Share the story behind your artwork, your inspiration, techniques used, and what makes it special..."
              rows="5"
              maxLength="2000"
            />
            <div className="textarea-icon">📝</div>
          </div>
          <div className="textarea-footer">
            <div className="char-counter">{formData.description.length}/2000</div>
            <div className="help-text">Rich descriptions help buyers connect with your art</div>
          </div>
          {errors.description && (
            <span className="super-field-error">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="super-form-section">
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <h4>Classification</h4>
        </div>

        <div className="super-form-row">
          <div className="super-form-group">
            <label htmlFor="category" className="super-label">
              <span className="label-text">Category</span>
              <span className="required-star">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
                className={`super-form-select ${errors.category ? "error" : ""}`}
              >
                <option value="">Choose your art category</option>
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="select-icon">🎨</div>
            </div>
            {errors.category && (
              <span className="super-field-error">{errors.category}</span>
            )}
          </div>

          <div className="super-form-group">
            <label htmlFor="subcategory" className="super-label">
              <span className="label-text">Subcategory</span>
              <span className="required-star">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={onChange}
                className={`super-form-select ${errors.subcategory ? "error" : ""}`}
                disabled={!formData.category}
              >
                <option value="">Choose subcategory</option>
                {formData.category &&
                  categories[formData.category]?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
              <div className="select-icon">🏷️</div>
            </div>
            {errors.subcategory && (
              <span className="super-field-error">{errors.subcategory}</span>
            )}
          </div>
        </div>

        <div className="super-form-row">
          <div className="super-form-group">
            <label htmlFor="artworkType" className="super-label">
              <span className="label-text">Type</span>
              <span className="required-star">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="artworkType"
                name="artworkType"
                value={formData.artworkType}
                onChange={onChange}
                className="super-form-select"
              >
                <option value="original">🎨 Original</option>
                <option value="print">🖨️ Print</option>
                <option value="digital">💻 Digital</option>
                <option value="nft">🔗 NFT</option>
                <option value="license">📄 License</option>
              </select>
              <div className="select-icon">🎭</div>
            </div>
          </div>

          <div className="super-form-group">
            <label htmlFor="medium" className="super-label">
              <span className="label-text">Medium</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="medium"
                type="text"
                name="medium"
                value={formData.medium}
                onChange={onChange}
                className={`super-form-input ${errors.medium ? "error" : ""}`}
                placeholder="e.g., Oil on canvas, Digital art, Watercolor..."
              />
              <div className="input-icon">🖌️</div>
            </div>
            {errors.medium && (
              <span className="super-field-error">{errors.medium}</span>
            )}
          </div>
        </div>
      </div>

      {/* Dimensions - only show for physical artworks */}
      {formData.artworkType !== "digital" && formData.artworkType !== "nft" && (
        <div className="super-form-section">
          <div className="section-header">
            <span className="section-icon">📏</span>
            <h4>Dimensions</h4>
            <span className="section-subtitle">Physical measurements of your artwork</span>
          </div>

          <div className="dimensions-grid">
            <div className="super-form-group">
              <label htmlFor="dimensions.width" className="super-label">
                <span className="label-text">Width</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="dimensions.width"
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={onChange}
                  className="super-form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
                <div className="input-icon">↔️</div>
              </div>
            </div>

            <div className="super-form-group">
              <label htmlFor="dimensions.height" className="super-label">
                <span className="label-text">Height</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="dimensions.height"
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={onChange}
                  className="super-form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
                <div className="input-icon">↕️</div>
              </div>
            </div>

            <div className="super-form-group">
              <label htmlFor="dimensions.depth" className="super-label">
                <span className="label-text">Depth</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="dimensions.depth"
                  type="number"
                  name="dimensions.depth"
                  value={formData.dimensions.depth}
                  onChange={onChange}
                  className="super-form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
                <div className="input-icon">⬌</div>
              </div>
            </div>

            <div className="super-form-group">
              <label htmlFor="dimensions.unit" className="super-label">
                <span className="label-text">Unit</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="dimensions.unit"
                  name="dimensions.unit"
                  value={formData.dimensions.unit}
                  onChange={onChange}
                  className="super-form-select"
                >
                  <option value="cm">📐 cm</option>
                  <option value="in">📏 inches</option>
                  <option value="mm">📌 mm</option>
                </select>
                <div className="select-icon">📐</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="super-form-section">
        <div className="section-header">
          <span className="section-icon">🎪</span>
          <h4>Additional Details</h4>
          <span className="section-subtitle">Help buyers understand your artistic style</span>
        </div>

        <div className="super-form-row">
          <div className="super-form-group">
            <label htmlFor="yearCreated" className="super-label">
              <span className="label-text">Year Created</span>
            </label>
            <div className="input-wrapper">
              <input
                id="yearCreated"
                type="number"
                name="yearCreated"
                value={formData.yearCreated}
                onChange={onChange}
                className="super-form-input"
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
              />
              <div className="input-icon">📅</div>
            </div>
          </div>

          <div className="super-form-group">
            <label htmlFor="style" className="super-label">
              <span className="label-text">Style</span>
            </label>
            <div className="input-wrapper">
              <input
                id="style"
                type="text"
                name="style"
                value={formData.style}
                onChange={onChange}
                className="super-form-input"
                placeholder="e.g., Abstract, Realistic, Impressionist..."
              />
              <div className="input-icon">🎨</div>
            </div>
          </div>
        </div>

        <div className="super-form-group">
          <label htmlFor="technique" className="super-label">
            <span className="label-text">Technique</span>
          </label>
          <div className="input-wrapper">
            <input
              id="technique"
              type="text"
              name="technique"
              value={formData.technique}
              onChange={onChange}
              className="super-form-input"
              placeholder="e.g., Brush painting, Digital illustration, Mixed media..."
            />
            <div className="input-icon">🖌️</div>
          </div>
        </div>

        <div className="super-form-group">
          <label htmlFor="tags" className="super-label">
            <span className="label-text">Tags</span>
          </label>
          <div className="input-wrapper">
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onChange}
              className="super-form-input"
              placeholder="abstract, colorful, modern, landscape, portrait..."
            />
            <div className="input-icon">🏷️</div>
          </div>
          <div className="help-text">
            <span className="help-icon">💡</span>
            Use relevant tags to help art lovers discover your work
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
