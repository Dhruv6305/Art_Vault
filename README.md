# 🎨 ArtVault - Digital Art Marketplace

A full-stack web application for artists to showcase, sell, and manage their digital artwork. Built with React, Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Functionalities](#functionalities)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure authentication with JWT tokens
- **Google OAuth Integration**: Sign in with Google account
- **Session Management**: Persistent login sessions with token refresh
- **Password Security**: Bcrypt password hashing
- **Protected Routes**: Role-based access control

### 🎨 Artwork Management
- **Upload Artworks**: Support for multiple file types (images, videos, audio, 3D models, documents)
- **Multiple File Upload**: Upload multiple files per artwork
- **Folder Upload**: Bulk upload entire folders of artwork files
- **3D Model Support**: Upload and display 3D models (.gltf, .glb, .obj, .fbx, etc.)
- **Edit Artworks**: Update artwork details, pricing, and files
- **Delete Artworks**: Remove artworks from the platform
- **Artwork Categories**: Digital Art, Photography, Visual Art, 3D Models, Sculptures, and more
- **Artwork Metadata**: Title, description, medium, dimensions, year created, style, technique
- **Pricing Options**: Set prices in multiple currencies (USD, EUR, GBP, INR, CAD, AUD)
- **Negotiable Pricing**: Mark artworks as negotiable
- **Quantity Management**: Track available quantities for limited editions

### 🛒 E-Commerce Features
- **Browse Artworks**: Search and filter artworks by category, price, artist
- **Artwork Detail View**: Comprehensive artwork information with image gallery
- **Shopping Cart**: Add artworks to cart (quantity management)
- **Order Management**: Complete order workflow from cart to delivery
- **Payment Processing**: Simulated payment system with card details
- **Order Tracking**: Track order status (pending, confirmed, processing, shipped, delivered)
- **Shipping Options**: Standard, Express, and Overnight shipping
- **Multi-Currency Support**: Prices displayed in artwork's native currency
- **Tax Calculation**: Automatic tax calculation (8%)
- **Order History**: View past orders and their status
- **Cancelled Orders**: View and manage cancelled orders

### 💳 Payment System
- **Order Summary**: Review order details before payment
- **Shipping Information**: Enter delivery address and contact details
- **Payment Form**: Secure payment form with card validation
- **Payment Success**: Order confirmation with printable receipt
- **Currency Formatting**: Proper currency display throughout checkout
- **Transaction IDs**: Unique transaction tracking

### 📊 Analytics & Insights
- **Platform Analytics**: Overall platform statistics and trends
  - Total users and monthly growth
  - Total artworks and upload trends
  - Platform engagement metrics
  - Monthly upload charts
  
- **Artist Analytics**: Performance metrics for artists
  - Top performing artists by sales
  - Sales trends over time
  - Rating distribution
  - Revenue tracking
  
- **Audience Analytics**: User behavior insights
  - Geographic distribution
  - Category trends
  - Age group demographics
  
- **User Dashboard**: Personal analytics for artists
  - Total artworks, views, and likes
  - Monthly revenue charts
  - Monthly sales charts
  - Top performing artworks

### 🎯 User Dashboard
- **Quick Stats**: Overview of artworks, collections, and favorites
- **Quick Actions**: Upload artwork, browse marketplace, view collections
- **Recent Activity**: Latest uploads and interactions
- **Performance Charts**: Visual representation of revenue and sales

### 🔍 Search & Discovery
- **Advanced Search**: Search by title, artist, category, tags
- **Filters**: Filter by price range, category, availability
- **3D Model Filters**: Specialized filters for 3D content
- **Sort Options**: Sort by newest, price, popularity

### 👤 User Profile
- **Profile Management**: Update personal information
- **Artist Profile**: Showcase artist bio and portfolio
- **My Artworks**: Manage personal artwork collection
- **Order Management**: View purchases and sales

### 🔔 Notifications
- **Real-time Notifications**: Get notified about orders, likes, and comments
- **Notification Bell**: Visual indicator for unread notifications
- **Notification History**: View all past notifications

### 📱 Responsive Design
- **Mobile Friendly**: Fully responsive design for all devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Dark/Light Theme**: Consistent color scheme throughout
- **Accessibility**: ARIA labels and keyboard navigation support

---

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with CSS variables
- **Intl API**: International currency and number formatting

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Passport.js**: Authentication middleware
- **Multer**: File upload handling
- **Nodemailer**: Email notifications

### Development Tools
- **Nodemon**: Auto-restart server on changes
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

---

## 📁 Project Structure

```
Art_Vault/
├── artvault-backend/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   └── passport.js           # Passport configuration
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── artworkController.js
│   │   ├── authController.js
│   │   ├── notificationController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── Artwork.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── artwork.js
│   │   ├── auth.js
│   │   ├── notifications.js
│   │   └── orders.js
│   ├── uploads/                  # Uploaded files
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
├── artvault-frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js          # Axios configuration
│   │   │   └── payments.js       # Payment API
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   ├── payment/
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   ├── PaymentModal.jsx
│   │   │   │   └── PaymentSuccess.jsx
│   │   │   ├── ui/
│   │   │   │   ├── ArtworkCard.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── FolderUpload.jsx
│   │   │   └── filters/
│   │   │       └── ThreeDFilters.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── hooks/
│   │   │   └── useToast.js       # Toast notifications
│   │   ├── pages/
│   │   │   ├── AddArtwork.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── ArtworkDetail.jsx
│   │   │   ├── BrowseArtworks.jsx
│   │   │   ├── CancelledOrders.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditArtwork.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyArtworks.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/
│   │   │   ├── Analytics.css
│   │   │   └── PaymentModal.css
│   │   ├── utils/
│   │   │   └── formatters.js     # Utility functions
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd artvault-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the server:
```bash
npm start
# or for development with auto-restart
npm run server
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd artvault-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/artvault` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your_google_secret` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/user` - Get current user

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get artwork by ID
- `GET /api/artworks/user/:userId` - Get user's artworks
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `POST /api/artworks/:id/like` - Like/unlike artwork

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/sales` - Get artist's sales
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Analytics
- `GET /api/analytics/platform` - Get platform insights
- `GET /api/analytics/artists` - Get artist insights
- `GET /api/analytics/audience` - Get audience insights
- `GET /api/analytics/user` - Get user-specific analytics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 👥 User Roles

### Artist
- Upload and manage artworks
- View sales and revenue
- Track artwork performance
- Manage orders and shipping
- Access analytics dashboard

### Buyer
- Browse and search artworks
- Purchase artworks
- Track orders
- View order history
- Manage profile

---

## 🎯 Functionalities

### 1. User Authentication
- **Registration**: Create account with email and password
- **Login**: Secure login with JWT tokens
- **Google OAuth**: Quick sign-in with Google
- **Session Persistence**: Stay logged in across sessions
- **Logout**: Secure logout with token cleanup

### 2. Artwork Upload & Management
- **Single File Upload**: Upload individual artwork files
- **Multiple File Upload**: Upload multiple files at once
- **Folder Upload**: Bulk upload entire folders
- **File Types Supported**:
  - Images: JPG, PNG, GIF, WebP
  - Videos: MP4, WebM, AVI
  - Audio: MP3, WAV, OGG
  - 3D Models: GLTF, GLB, OBJ, FBX, STL, BLEND
  - Documents: PDF
- **Artwork Details**:
  - Title and description
  - Category and subcategory
  - Medium and technique
  - Dimensions (width, height, depth)
  - Year created
  - Style and tags
  - Location information
- **Pricing**:
  - Set price in multiple currencies
  - Mark as negotiable
  - Set quantity for limited editions
- **Shipping Options**:
  - Enable/disable shipping
  - Set shipping cost
  - International shipping support

### 3. Browse & Search
- **Search Bar**: Search by title, artist, tags
- **Category Filters**: Filter by artwork category
- **Price Range**: Filter by minimum and maximum price
- **Availability**: Show only available artworks
- **3D Model Filters**: Specialized filters for 3D content
- **Sort Options**:
  - Newest first
  - Price: Low to High
  - Price: High to Low
  - Most Popular

### 4. Artwork Detail View
- **Image Gallery**: View all artwork images
- **3D Model Viewer**: Interactive 3D model display
- **Artwork Information**: Complete artwork details
- **Artist Information**: Artist name and profile
- **Pricing**: Price in artwork's currency
- **Availability**: Stock quantity
- **Dimensions**: Size specifications
- **Actions**:
  - Buy Now
  - Add to Cart
  - Like/Unlike
  - Share
  - Edit (for owner)
  - Delete (for owner)

### 5. Shopping Cart & Checkout
- **Add to Cart**: Add artworks with quantity selection
- **Cart Management**: Update quantities or remove items
- **Order Summary**:
  - Artwork details
  - Quantity selection
  - Subtotal calculation
  - Tax calculation (8%)
  - Shipping cost (based on method)
  - Total amount
- **Shipping Information**:
  - Full name and email
  - Phone number
  - Delivery address
  - City, state, ZIP code
  - Country
- **Shipping Methods**:
  - Standard (5-7 business days)
  - Express (2-3 business days)
  - Overnight (next business day)
- **Payment Form**:
  - Cardholder name
  - Card number (formatted)
  - Expiry date (MM/YY)
  - CVV
  - Billing address
- **Order Confirmation**:
  - Transaction ID
  - Order number
  - Estimated delivery date
  - Printable receipt

### 6. Order Management
- **Order History**: View all past orders
- **Order Details**:
  - Artwork information
  - Buyer/Seller information
  - Shipping address
  - Payment details
  - Order status
  - Tracking number (if available)
- **Order Status**:
  - Pending
  - Confirmed
  - Processing
  - Shipped
  - Delivered
  - Cancelled
  - Refunded
- **Actions**:
  - Update status (for sellers)
  - Cancel order (for buyers)
  - Track shipment
  - Contact support

### 7. Analytics Dashboard
- **Platform Insights**:
  - Total users and growth rate
  - Total artworks and upload trends
  - Monthly upload charts
  - Engagement metrics
- **Artist Insights**:
  - Top performing artists
  - Sales trends
  - Rating distribution
  - Revenue tracking
- **Audience Insights**:
  - Geographic distribution
  - Category preferences
  - Age group demographics
- **Interactive Charts**:
  - Line charts with hover tooltips
  - Bar charts with animations
  - Doughnut charts with segment highlighting
  - Real-time data updates

### 8. User Dashboard
- **Quick Stats**:
  - Total artworks uploaded
  - Total collections
  - Total favorites/likes
- **Quick Actions**:
  - Upload new artwork
  - Browse artworks
  - View collections
- **Performance Charts**:
  - Monthly revenue (last 6 months)
  - Monthly sales (last 6 months)
- **Recent Activity**: Latest uploads and interactions

### 9. Profile Management
- **Personal Information**:
  - Name and email
  - Profile picture
  - Bio and description
  - Location
- **Artist Profile**:
  - Portfolio showcase
  - Artist statement
  - Social media links
- **Account Settings**:
  - Change password
  - Email preferences
  - Privacy settings

### 10. Notifications
- **Notification Types**:
  - New order received
  - Order status updated
  - Artwork liked
  - New follower
  - Comment on artwork
- **Notification Bell**: Visual indicator for unread notifications
- **Mark as Read**: Individual or bulk mark as read
- **Delete Notifications**: Remove old notifications

### 11. Multi-Currency Support
- **Supported Currencies**:
  - USD (US Dollar)
  - EUR (Euro)
  - GBP (British Pound)
  - INR (Indian Rupee)
  - CAD (Canadian Dollar)
  - AUD (Australian Dollar)
- **Currency Display**:
  - Proper currency symbols
  - Locale-specific formatting
  - Automatic conversion display
- **Currency-Specific Pricing**:
  - Shipping costs in artwork currency
  - Tax calculation in artwork currency
  - Total amount in artwork currency

### 12. File Management
- **Upload Progress**: Real-time upload progress bars
- **File Validation**: Check file types and sizes
- **Image Preview**: Preview images before upload
- **3D Model Preview**: Preview 3D models before upload
- **File Organization**: Organize files by artwork
- **File Deletion**: Remove unwanted files

### 13. Security Features
- **Password Hashing**: Bcrypt encryption
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based access control
- **Input Validation**: Server-side validation
- **XSS Protection**: Sanitize user inputs
- **CORS Configuration**: Secure cross-origin requests

### 14. Responsive Design
- **Mobile Optimization**: Touch-friendly interface
- **Tablet Support**: Optimized for tablets
- **Desktop Experience**: Full-featured desktop UI
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### 15. UI/UX Features
- **Loading States**: Spinners and skeletons
- **Error Handling**: User-friendly error messages
- **Success Messages**: Toast notifications
- **Form Validation**: Real-time validation feedback
- **Smooth Animations**: CSS transitions and transforms
- **Hover Effects**: Interactive hover states
- **Modal Dialogs**: Confirmation and info modals
- **Tooltips**: Helpful hints and tips

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Info**: Cyan (#06b6d4)

### Typography
- **Font Family**: System fonts (Arial, Helvetica, sans-serif)
- **Headings**: Bold, larger sizes
- **Body Text**: Regular weight, readable size
- **Monospace**: Code and technical text

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Scale**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem

### Components
- **Buttons**: Primary, secondary, danger, success
- **Cards**: Elevated cards with shadows
- **Forms**: Labeled inputs with validation
- **Modals**: Centered overlays with backdrop
- **Tables**: Responsive data tables
- **Charts**: Interactive SVG charts

---

## 📸 Screenshots

*(Add screenshots of your application here)*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Express.js team for the backend framework
- All open-source contributors

---

## 📞 Support

For support, email support@artvault.com or join our Slack channel.

---

## 🔮 Future Enhancements

- [ ] Real payment gateway integration (Stripe, PayPal)
- [ ] Live chat support
- [ ] Artwork recommendations based on user preferences
- [ ] Social features (follow artists, comments, shares)
- [ ] Advanced search with AI-powered suggestions
- [ ] Mobile app (React Native)
- [ ] Auction system for rare artworks
- [ ] NFT integration
- [ ] Multi-language support
- [ ] Advanced analytics with ML insights
- [ ] Artist verification system
- [ ] Artwork authentication certificates
- [ ] Print-on-demand service
- [ ] Subscription plans for artists
- [ ] Artwork licensing options

---

## 📊 Project Stats

- **Total Lines of Code**: ~15,000+
- **Components**: 30+
- **API Endpoints**: 25+
- **Database Models**: 4
- **Supported File Types**: 20+
- **Supported Currencies**: 6

---

**Made with ❤️ by the ArtVault Team**
