const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "sale",
        "purchase",
        "like",
        "comment",
        "follow",
        "order_update",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ type: 1 });

// Mark notification as read
NotificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Notification", NotificationSchema);
