import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import FileUpload from "../components/ui/FileUpload.jsx";
import ArtworkForm from "../components/ui/ArtworkForm.jsx";

const EditArtwork = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        subcategory: "",
        artworkType: "original",
        medium: "",
        dimensions: {
            width: "",
            height: "",
            depth: "",
            unit: "cm",
        },
        price: {
            amount: "",
            currency: "INR",
            negotiable: false,
        },
        quantity: 1,
        tags: "",
        yearCreated: "",
        style: "",
        technique: "",
        location: {
            city: user?.city || "",
            state: user?.state || "",
            country: user?.country || "",
        },
        shipping: {
            available: true,
            cost: 0,
            methods: ["standard"],
        },
        files: [],
        availability: "draft",
    });

    const categories = {
        visual_art: {
            label: "Visual Art",
            subcategories: [
                "Painting",
                "Drawing",
                "Illustration",
                "Mixed Media",
                "Collage",
                "Street Art",
            ],
        },
        photography: {
            label: "Photography",
            subcategories: [
                "Portrait",
                "Landscape",
                "Abstract",
                "Documentary",
                "Fashion",
                "Wildlife",
            ],
        },
        digital_art: {
            label: "Digital Art",
            subcategories: [
                "Digital Painting",
                "3D Art",
                "Animation",
                "Concept Art",
                "Graphic Design",
                "NFT",
            ],
        },
        "3d_model": {
            label: "3D Models",
            subcategories: [
                "Characters",
                "Environments",
                "Props",
                "Vehicles",
                "Architecture",
                "Abstract",
                "Game Assets",
                "Printable Models",
            ],
        },
        sculpture: {
            label: "Sculpture",
            subcategories: [
                "Clay",
                "Metal",
                "Wood",
                "Stone",
                "Glass",
                "Mixed Materials",
            ],
        },
        music: {
            label: "Music",
            subcategories: [
                "Original Song",
                "Instrumental",
                "Beat/Loop",
                "Sound Effect",
                "Podcast",
                "Voice Over",
            ],
        },
        video: {
            label: "Video",
            subcategories: [
                "Short Film",
                "Animation",
                "Music Video",
                "Documentary",
                "Commercial",
                "Art Video",
            ],
        },
        other: {
            label: "Other",
            subcategories: [
                "Craft",
                "Textile",
                "Jewelry",
                "Ceramics",
                "Performance Art",
                "Installation",
            ],
        },
    };

    useEffect(() => {
        if (user && id) {
            fetchArtwork();
        }
    }, [user, id]);

    const fetchArtwork = async () => {
        try {
            setInitialLoading(true);
            const response = await api.get(`/artworks/${id}`);

            if (response.data.success) {
                const artwork = response.data.artwork;

                // Check if user owns this artwork
                if (artwork.artist._id !== user._id && artwork.artist._id !== user.id) {
                    setErrors({ general: "You don't have permission to edit this artwork" });
                    return;
                }

                // Convert tags array to string if needed
                const tagsString = Array.isArray(artwork.tags) ? artwork.tags.join(", ") : artwork.tags || "";

                setFormData({
                    title: artwork.title || "",
                    description: artwork.description || "",
                    category: artwork.category || "",
                    subcategory: artwork.subcategory || "",
                    artworkType: artwork.artworkType || "original",
                    medium: artwork.medium || "",
                    dimensions: {
                        width: artwork.dimensions?.width || "",
                        height: artwork.dimensions?.height || "",
                        depth: artwork.dimensions?.depth || "",
                        unit: artwork.dimensions?.unit || "cm",
                    },
                    price: {
                        amount: artwork.price?.amount || "",
                        currency: artwork.price?.currency || "INR",
                        negotiable: artwork.price?.negotiable || false,
                    },
                    quantity: artwork.quantity || 1,
                    tags: tagsString,
                    yearCreated: artwork.yearCreated || "",
                    style: artwork.style || "",
                    technique: artwork.technique || "",
                    location: {
                        city: artwork.location?.city || user?.city || "",
                        state: artwork.location?.state || user?.state || "",
                        country: artwork.location?.country || user?.country || "",
                    },
                    shipping: {
                        available: artwork.shipping?.available !== false,
                        cost: artwork.shipping?.cost || 0,
                        methods: artwork.shipping?.methods || ["standard"],
                    },
                    files: artwork.files || [],
                    availability: artwork.availability || "draft",
                });
            }
        } catch (err) {
            console.error("Fetch artwork error:", err);
            setErrors({ general: "Failed to load artwork details" });
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFilesChange = (files) => {
        setFormData((prev) => ({ ...prev, files }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = "Title is required";
            if (!formData.description.trim())
                newErrors.description = "Description is required";
            if (!formData.category) newErrors.category = "Category is required";
            if (!formData.subcategory)
                newErrors.subcategory = "Subcategory is required";
            if (!formData.medium.trim()) newErrors.medium = "Medium is required";
            if (!formData.price.amount || formData.price.amount <= 0) {
                newErrors["price.amount"] = "Price must be greater than 0";
            }
        }

        if (step === 2) {
            if (!formData.price.amount || formData.price.amount <= 0) {
                newErrors["price.amount"] = "Price must be greater than 0";
            }
            if (formData.files.length === 0) {
                newErrors.files = "At least one file is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (isDraft = false) => {
        if (!validateStep(2)) return;

        setLoading(true);
        setErrors({});

        try {
            const submitData = {
                ...formData,
                availability: isDraft ? "draft" : formData.availability,
            };

            const response = await api.put(`/artworks/${id}`, submitData);

            if (response.data.success) {
                setSuccessMessage(
                    isDraft
                        ? "Artwork saved as draft successfully!"
                        : "Artwork updated successfully!"
                );

                setTimeout(() => {
                    navigate("/my-artworks");
                }, 2000);
            }
        } catch (err) {
            console.error("Update error:", err);
            const errorMsg = err.response?.data?.msg || "Failed to update artwork";
            setErrors({ general: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="edit-artwork-page">
                <div className="auth-required">
                    <h2>Authentication Required</h2>
                    <p>Please log in to edit artwork.</p>
                </div>
            </div>
        );
    }

    if (initialLoading) {
        return (
            <div className="edit-artwork-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading artwork details...</p>
                </div>
            </div>
        );
    }

    if (errors.general && !formData.title) {
        return (
            <div className="edit-artwork-page">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{errors.general}</p>
                    <button onClick={() => navigate("/my-artworks")} className="btn btn-primary">
                        Back to My Artworks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="super-edit-artwork-page">
            <div className="super-edit-header">
                <div className="edit-header-icon">✏️</div>
                <div className="edit-header-content">
                    <h1>Edit Artwork</h1>
                    <p>Update your masterpiece with new details and files</p>
                </div>
                <div className="edit-progress">
                    <div className="progress-step">
                        <span className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</span>
                        <span className="step-label">Details</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <span className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</span>
                        <span className="step-label">Files & Pricing</span>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="super-success-message">
                    <div className="success-icon">✅</div>
                    <div className="success-content">
                        <h4>Success!</h4>
                        <p>{successMessage}</p>
                    </div>
                </div>
            )}

            {errors.general && (
                <div className="super-error-message">
                    <div className="error-icon">⚠️</div>
                    <div className="error-content">
                        <h4>Error</h4>
                        <p>{errors.general}</p>
                    </div>
                </div>
            )}

            <div className="super-edit-content">
                {currentStep === 1 && (
                    <>
                        <ArtworkForm
                            formData={formData}
                            categories={categories}
                            errors={errors}
                            onChange={handleInputChange}
                        />

                        {/* Super Pricing Section */}
                        <div className="super-form-section">
                            <div className="section-header">
                                <span className="section-icon">💰</span>
                                <h4>Pricing & Sales Details</h4>
                                <span className="section-subtitle">Set your artwork's value and availability</span>
                            </div>

                            <div className="super-form-group">
                                <label htmlFor="price.amount" className="super-label">
                                    <span className="label-text">Selling Price</span>
                                    <span className="required-star">*</span>
                                </label>

                                <div className="super-price-container">
                                    <div className="select-wrapper currency-select-wrapper">
                                        <select
                                            name="price.currency"
                                            value={formData.price.currency}
                                            onChange={handleInputChange}
                                            className="super-form-select currency-select"
                                        >
                                            <option value="INR">🇮🇳 INR</option>
                                            <option value="USD">🇺🇸 USD</option>
                                            <option value="EUR">🇪🇺 EUR</option>
                                            <option value="GBP">🇬🇧 GBP</option>
                                            <option value="CAD">🇨🇦 CAD</option>
                                            <option value="AUD">🇦🇺 AUD</option>
                                        </select>
                                        <div className="select-icon">💱</div>
                                    </div>

                                    <div className="input-wrapper price-input-wrapper">
                                        <input
                                            id="price.amount"
                                            type="number"
                                            name="price.amount"
                                            value={formData.price.amount}
                                            onChange={handleInputChange}
                                            className={`super-form-input ${errors["price.amount"] ? "error" : ""}`}
                                            placeholder="Enter your price..."
                                            min="0"
                                            step="0.01"
                                        />
                                        <div className="input-icon">💰</div>
                                    </div>
                                </div>

                                {formData.price.amount && (
                                    <div className="price-preview">
                                        <span className="preview-label">Preview:</span>
                                        <span className="formatted-price">
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: formData.price.currency || "INR",
                                            }).format(formData.price.amount)}
                                        </span>
                                    </div>
                                )}

                                {errors["price.amount"] && (
                                    <span className="super-field-error">{errors["price.amount"]}</span>
                                )}
                            </div>

                            <div className="super-form-row">
                                <div className="super-form-group">
                                    <label className="super-checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="price.negotiable"
                                            checked={formData.price.negotiable}
                                            onChange={handleInputChange}
                                        />
                                        <span className="super-checkbox"></span>
                                        <div className="checkbox-content">
                                            <span className="checkbox-title">💬 Open to Negotiation</span>
                                            <span className="checkbox-desc">Allow buyers to make offers</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="super-form-group">
                                    <label htmlFor="quantity" className="super-label">
                                        <span className="label-text">Quantity Available</span>
                                    </label>
                                    <div className="super-quantity-wrapper">
                                        <button
                                            type="button"
                                            className="quantity-btn decrease"
                                            onClick={() => {
                                                const newQty = Math.max(1, (formData.quantity || 1) - 1);
                                                handleInputChange({
                                                    target: { name: "quantity", value: newQty, type: "number" },
                                                });
                                            }}
                                        >
                                            −
                                        </button>
                                        <input
                                            id="quantity"
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className="super-quantity-input"
                                            min="1"
                                            max="999"
                                        />
                                        <button
                                            type="button"
                                            className="quantity-btn increase"
                                            onClick={() => {
                                                const newQty = Math.min(999, (formData.quantity || 1) + 1);
                                                handleInputChange({
                                                    target: { name: "quantity", value: newQty, type: "number" },
                                                });
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="help-text">
                                        <span className="help-icon">📦</span>
                                        How many copies or pieces are available?
                                    </div>
                                </div>
                            </div>

                            <div className="super-form-group">
                                <label htmlFor="availability" className="super-label">
                                    <span className="label-text">Availability Status</span>
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        id="availability"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        className="super-form-select"
                                    >
                                        <option value="draft">📝 Draft - Not visible to buyers</option>
                                        <option value="available">✅ Available - Ready for sale</option>
                                        <option value="reserved">⏳ Reserved - On hold</option>
                                        <option value="sold">💰 Sold - No longer available</option>
                                    </select>
                                    <div className="select-icon">📋</div>
                                </div>
                                <div className="help-text">
                                    <span className="help-icon">💡</span>
                                    Control how your artwork appears to potential buyers
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <div className="step-content">
                        <FileUpload
                            files={formData.files}
                            onChange={handleFilesChange}
                            error={errors.files}
                            isEdit={true}
                        />

                        <div className="super-form-section">
                            <div className="section-header">
                                <span className="section-icon">🚚</span>
                                <h4>Shipping & Additional Options</h4>
                                <span className="section-subtitle">Configure delivery and extra services</span>
                            </div>

                            <div className="super-form-group">
                                <label className="super-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="shipping.available"
                                        checked={formData.shipping.available}
                                        onChange={handleInputChange}
                                    />
                                    <span className="super-checkbox"></span>
                                    <div className="checkbox-content">
                                        <span className="checkbox-title">🚚 Shipping Available</span>
                                        <span className="checkbox-desc">Offer shipping to buyers</span>
                                    </div>
                                </label>
                            </div>

                            {formData.shipping.available && (
                                <div className="super-form-group">
                                    <label htmlFor="shipping.cost" className="super-label">
                                        <span className="label-text">Shipping Cost</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="shipping.cost"
                                            type="number"
                                            name="shipping.cost"
                                            value={formData.shipping.cost}
                                            onChange={handleInputChange}
                                            className="super-form-input"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        <div className="input-icon">💰</div>
                                    </div>
                                    <div className="help-text">
                                        <span className="help-icon">💡</span>
                                        Set to 0 for free shipping
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="super-edit-actions">
                <div className="actions-container">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="super-btn super-btn-secondary compact"
                            disabled={loading}
                        >
                            <span className="btn-icon">←</span>
                            <span className="btn-text">Previous</span>
                        </button>
                    )}

                    <div className="actions-right">
                        {currentStep < 2 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="super-btn super-btn-primary compact"
                            >
                                <span className="btn-text">Next Step</span>
                                <span className="btn-icon">→</span>
                            </button>
                        ) : (
                            <div className="final-actions">
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(true)}
                                    className="super-btn super-btn-draft compact"
                                    disabled={loading}
                                >
                                    <span className="btn-icon">📝</span>
                                    <span className="btn-text">{loading ? "Saving..." : "Save as Draft"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(false)}
                                    className={`super-btn super-btn-primary compact ${loading ? "loading" : ""}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            <span className="btn-text">Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">✨</span>
                                            <span className="btn-text">Update Artwork</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditArtwork;