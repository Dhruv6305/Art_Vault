const Order = require("../models/Order");
const Artwork = require("../models/Artwork");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/emailService");

// Create a new order
const createOrder = async (req, res) => {
  try {
    console.log("📦 Creating order with data:", {
      artworkId: req.body.artworkId,
      quantity: req.body.quantity,
      userId: req.user?.id,
      hasShippingInfo: !!req.body.shippingInfo,
      hasPaymentData: !!req.body.paymentData,
    });

    const {
      artworkId,
      quantity,
      shippingInfo,
      shippingMethod,
      paymentData,
      subtotal,
      tax,
      shipping,
      total,
    } = req.body;

    // Validate required fields
    if (!artworkId || !quantity || !shippingInfo || !paymentData) {
      console.log("❌ Missing required fields:", {
        artworkId: !!artworkId,
        quantity: !!quantity,
        shippingInfo: !!shippingInfo,
        paymentData: !!paymentData,
      });
      return res.status(400).json({
        success: false,
        msg: "Missing required fields",
      });
    }

    // Validate MongoDB ObjectId format
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      console.log("❌ Invalid artwork ID format:", artworkId);
      return res.status(400).json({
        success: false,
        msg: "Invalid artwork ID format",
      });
    }

    console.log("✅ Artwork ID is valid, looking up artwork...");

    // Get artwork details
    const artwork = await Artwork.findById(artworkId).populate("artist");
    if (!artwork) {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }

    // Check if enough quantity is available
    if (artwork.quantity < quantity) {
      return res.status(400).json({
        success: false,
        msg: `Only ${artwork.quantity} copies available`,
      });
    }

    // Create the order
    const order = new Order({
      buyer: req.user.id,
      artist: artwork.artist._id,
      artwork: artworkId,
      quantity,
      shippingInfo,
      shippingMethod,
      paymentData: {
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
        processedAt: paymentData.processedAt,
      },
      pricing: {
        subtotal,
        tax,
        shipping,
        total,
      },
      status: "confirmed",
    });

    await order.save();

    // Update artwork quantity
    artwork.quantity -= quantity;
    await artwork.save();

    // Create notification for artist
    const notification = new Notification({
      user: artwork.artist._id,
      type: "sale",
      title: "New Sale!",
      message: `Your artwork "${artwork.title}" has been sold! ${quantity} ${
        quantity > 1 ? "copies" : "copy"
      } purchased by ${shippingInfo.fullName}.`,
      data: {
        orderId: order._id,
        artworkId: artwork._id,
        quantity,
        total,
        buyerName: shippingInfo.fullName,
      },
    });

    await notification.save();

    // Send email to artist (non-blocking)
    sendEmail({
      to: artwork.artist.email,
      subject: `🎉 Great News! Your artwork "${artwork.title}" has been sold!`,
      template: "artistSaleNotification",
      data: {
        artistName: artwork.artist.name,
        artworkTitle: artwork.title,
        quantity,
        total: total.toFixed(2),
        buyerName: shippingInfo.fullName,
        buyerEmail: shippingInfo.email,
        orderId: order._id,
        remainingQuantity: artwork.quantity,
        shippingMethod,
        estimatedDelivery: getEstimatedDelivery(shippingMethod),
      },
    }).catch((emailError) => {
      console.error(
        "📧 Failed to send artist notification email:",
        emailError.message
      );
    });

    // Send confirmation email to buyer (non-blocking)
    sendEmail({
      to: shippingInfo.email,
      subject: `Order Confirmation - ${artwork.title}`,
      template: "orderConfirmation",
      data: {
        buyerName: shippingInfo.fullName,
        artworkTitle: artwork.title,
        artistName: artwork.artist.name,
        quantity,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        orderId: order._id,
        transactionId: paymentData.transactionId,
        shippingAddress: shippingInfo,
        shippingMethod,
        estimatedDelivery: getEstimatedDelivery(shippingMethod),
      },
    }).catch((emailError) => {
      console.error(
        "📧 Failed to send buyer confirmation email:",
        emailError.message
      );
    });

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate("artwork", "title files price")
      .populate("artist", "name email")
      .populate("buyer", "name email");

    res.status(201).json({
      success: true,
      msg: "Order created successfully",
      order: populatedOrder,
      remainingQuantity: artwork.quantity,
    });
  } catch (error) {
    console.error("❌ Create order error:", error.message);
    console.error("📋 Error stack:", error.stack);
    console.error("🔍 Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      artworkId: req.body.artworkId,
      userId: req.user?.id,
      requestBody: JSON.stringify(req.body, null, 2),
    });

    // Provide more specific error messages
    let errorMessage = "Server error occurred while creating order";

    if (error.name === "ValidationError") {
      errorMessage = "Invalid order data: " + error.message;
    } else if (error.name === "CastError") {
      errorMessage = "Invalid ID format in order data";
    } else if (error.code === 11000) {
      errorMessage = "Duplicate order detected";
    }

    res.status(500).json({
      success: false,
      msg: errorMessage,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("artwork", "title files price")
      .populate("artist", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get artist's sales
const getArtistSales = async (req, res) => {
  try {
    const sales = await Order.find({ artist: req.user.id })
      .populate("artwork", "title files price")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, sales });
  } catch (error) {
    console.error("Get artist sales error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("artwork", "title files price")
      .populate("artist", "name email")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.artist._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Update order status (for artists)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id).populate("buyer artwork");

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    // Check if user is the artist
    if (order.artist.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.updatedAt = new Date();

    await order.save();

    // Send update email to buyer
    try {
      await sendEmail({
        to: order.buyer.email,
        subject: `Order Update - ${order.artwork.title}`,
        template: "orderUpdate",
        data: {
          buyerName: order.buyer.name,
          artworkTitle: order.artwork.title,
          orderId: order._id,
          status,
          trackingNumber,
        },
      });
    } catch (emailError) {
      console.error("Failed to send order update email:", emailError);
    }

    res.json({ success: true, msg: "Order updated successfully", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Helper function to calculate estimated delivery
const getEstimatedDelivery = (shippingMethod) => {
  const today = new Date();
  let deliveryDays;

  switch (shippingMethod) {
    case "standard":
      deliveryDays = 7;
      break;
    case "express":
      deliveryDays = 3;
      break;
    case "overnight":
      deliveryDays = 1;
      break;
    default:
      deliveryDays = 7;
  }

  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);

  return deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

module.exports = {
  createOrder,
  getUserOrders,
  getArtistSales,
  getOrderDetails,
  updateOrderStatus,
};
