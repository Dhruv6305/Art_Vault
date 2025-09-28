const nodemailer = require("nodemailer");

// Create transporter (using Gmail for demo - replace with your email service)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

// Email templates
const emailTemplates = {
  artistSaleNotification: (data) => ({
    subject: `🎉 Great News! Your artwork "${data.artworkTitle}" has been sold!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Your artwork has been sold!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Sale Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Artwork:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.artworkTitle
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Quantity Sold:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.quantity
              } ${data.quantity > 1 ? "copies" : "copy"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Sale Amount:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #28a745; font-weight: bold;">$${
                data.total
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Remaining Copies:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.remainingQuantity
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Buyer:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.buyerName
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.orderId
              }</td>
            </tr>
          </table>
        </div>

        <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; border-left: 4px solid #2c5aa0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">Next Steps</h3>
          <ul style="color: #333; line-height: 1.6;">
            <li>The buyer has selected <strong>${
              data.shippingMethod
            }</strong> shipping</li>
            <li>Estimated delivery: <strong>${
              data.estimatedDelivery
            }</strong></li>
            <li>Please prepare your artwork for shipping</li>
            <li>You'll receive payment processing details separately</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/dashboard" style="background: #2c5aa0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order Details</a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for using ArtVault!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.artworkTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #28a745; color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Thank you for your purchase!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.orderId
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Transaction ID:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.transactionId
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Artwork:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.artworkTitle
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Artist:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.artistName
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.quantity
              }</td>
            </tr>
          </table>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Pricing Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Subtotal:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${
                data.subtotal
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Tax:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${
                data.tax
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Shipping:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${
                data.shipping
              }</td>
            </tr>
            <tr style="font-weight: bold; font-size: 18px;">
              <td style="padding: 12px 0; border-top: 2px solid #333;">Total:</td>
              <td style="padding: 12px 0; border-top: 2px solid #333; text-align: right; color: #28a745;">$${
                data.total
              }</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">Shipping Information</h3>
          <p style="margin: 0; color: #333;"><strong>${
            data.shippingAddress.fullName
          }</strong></p>
          <p style="margin: 5px 0; color: #333;">${
            data.shippingAddress.address
          }</p>
          <p style="margin: 5px 0; color: #333;">${
            data.shippingAddress.city
          }, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>
          <p style="margin: 5px 0; color: #333;">${
            data.shippingAddress.country
          }</p>
          <p style="margin: 15px 0 5px 0; color: #333;"><strong>Shipping Method:</strong> ${
            data.shippingMethod.charAt(0).toUpperCase() +
            data.shippingMethod.slice(1)
          }</p>
          <p style="margin: 5px 0; color: #333;"><strong>Estimated Delivery:</strong> ${
            data.estimatedDelivery
          }</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/orders" style="background: #2c5aa0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Your Order</a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for supporting artists on ArtVault!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `,
  }),

  orderUpdate: (data) => ({
    subject: `Order Update - ${data.artworkTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #17a2b8; color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📦 Order Update</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Your order status has been updated</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.orderId
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Artwork:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
                data.artworkTitle
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #28a745; font-weight: bold; text-transform: capitalize;">${
                data.status
              }</td>
            </tr>
            ${
              data.trackingNumber
                ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Tracking Number:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.trackingNumber}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/orders" style="background: #2c5aa0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order Details</a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();

    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html: data.html || data.text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ArtVault" <noreply@artvault.com>',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
