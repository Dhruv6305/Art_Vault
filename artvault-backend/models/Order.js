const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: false }, // Temporarily optional for testing
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "United States" },
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "overnight"],
      required: true,
      default: "standard",
    },
    paymentData: {
      transactionId: { type: String, required: true },
      paymentMethod: { type: String, required: true },
      processedAt: { type: Date, required: true },
      customerEmail: { type: String, required: false },
      amount: { type: Number, required: false },
      currency: { type: String, required: false },
      last4: { type: String, required: false },
      brand: { type: String, required: false },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      shipping: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ artist: 1, createdAt: -1 });
OrderSchema.index({ artwork: 1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
