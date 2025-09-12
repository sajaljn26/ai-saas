# AI SaaS Platform

A comprehensive AI-powered SaaS platform offering various AI tools for content creation, image processing, and document analysis. Built with React, Node.js, and integrated with multiple AI services.

## 🌐 Live Demo

- **Frontend**: https://ai-saas-8cgp.vercel.app/
- **Backend**: https://ai-saas-server-mauve.vercel.app/

## ✨ Features

### AI Tools
- **Article Writer**: Generate high-quality articles using AI
- **Blog Title Generator**: Create engaging blog titles
- **Image Generator**: Create images from text prompts
- **Background Remover**: Remove image backgrounds automatically
- **Object Remover**: Remove specific objects from images
- **Resume Reviewer**: Get AI-powered feedback on resumes

### User Features
- **Community**: Share and discover AI-generated creations
- **Dashboard**: Track your creations and usage
- **Authentication**: Secure login with Clerk
- **Premium Plans**: Access to advanced features

### Technical Features
- **Real-time Generation**: Instant AI content creation
- **Cloud Storage**: Images stored on Cloudinary
- **Database**: PostgreSQL with Neon
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (Neon)
- **Clerk** - Authentication middleware
- **Cloudinary** - Image storage and processing
- **OpenAI/Gemini** - AI text generation
- **ClipDrop** - AI image generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account
- API keys for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sajaljn26/ai-saas.git
   cd ai-saas
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**

   **Client (.env)**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BASE_URL=http://localhost:3000
   ```

   **Server (.env)**
   ```env
   DATABASE_URL=your_postgresql_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLIPDROP_API_KEY=your_clipdrop_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   ```

4. **Database Setup**
   - Create tables in your PostgreSQL database:
   ```sql
   CREATE TABLE creations (
     id SERIAL PRIMARY KEY,
     user_id TEXT NOT NULL,
     prompt TEXT,
     content TEXT,
     type TEXT,
     publish BOOLEAN DEFAULT false,
     likes TEXT[] DEFAULT '{}',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Clerk Setup**
   - Create a Clerk application
   - Configure authentication providers
   - Set up webhooks for subscription management
   - Add webhook endpoint: `https://your-domain.com/api/webhooks/clerk-webhook`

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run server
   ```

2. **Start the frontend**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📁 Project Structure

```
ai-saas/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   └── ...
│   ├── public/            # Public assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── configs/          # Configuration files
│   └── package.json
├── .gitignore            # Git ignore rules
└── README.md            # Project documentation
```

## 🔧 API Endpoints

### Authentication Required
- `GET /api/user/get-user-creations` - Get user's creations
- `GET /api/user/get-published-creations` - Get community creations
- `POST /api/user/toggle-like-creation` - Like/unlike creations
- `GET /api/user/get-user-plan` - Get user's plan info

### AI Tools
- `POST /api/ai/generate-article` - Generate article
- `POST /api/ai/generate-blog-title` - Generate blog title
- `POST /api/ai/generate-image` - Generate image
- `POST /api/ai/remove-image-background` - Remove background
- `POST /api/ai/remove-image-object` - Remove object
- `POST /api/ai/resume-review` - Review resume

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Vercel/Railway)
1. Set up your backend on Vercel or Railway
2. Configure environment variables
3. Update frontend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support or questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [OpenAI](https://openai.com) for AI services
- [Cloudinary](https://cloudinary.com) for image storage
- [Neon](https://neon.tech) for PostgreSQL hosting