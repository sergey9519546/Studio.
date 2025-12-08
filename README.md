# Studio Roster - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Setup Environment

```bash
# Generate JWT secret
$JWT_SECRET = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Create .env file (copy from .env.example) and set:
# Run Postgres locally (e.g. docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=studio_roster postgres:16)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studio_roster?schema=public"
JWT_SECRET="$JWT_SECRET"
ADMIN_EMAIL="admin@studio.com"
ADMIN_PASSWORD="change-this-password"
GCP_PROJECT_ID="your-project-id"
STORAGE_BUCKET="your-project-assets"
# Optional: only needed when the API is on a different host/port than the SPA
VITE_API_URL="http://localhost:3001/api/v1"
```

### 3. Initialize Database & Run

```bash
npx prisma generate
npx prisma migrate dev       # Create and apply migrations for local development (requires the Postgres instance above)

# Start development server (frontend + API)
npm run dev
```

**That's it!** Visit http://localhost:5173

---

## 🔑 First Login

The system automatically creates an admin user on first startup:

- **Email:** Value from `ADMIN_EMAIL` in .env
- **Password:** Value from `ADMIN_PASSWORD` in .env

**⚠️ Change the default password immediately!**

---

## 📦 What's Included

- ✅ **Secure Authentication** - Bcrypt + JWT
- ✅ **Vertex AI Integration** - Production-ready AI
- ✅ **Type-Safe API** - DTOs with validation
- ✅ **Rate Limiting** - 100 req/60sec
- ✅ **Error Handling** - ErrorBoundary component
- ✅ **Cloud Ready** - Optimized Docker + deploy scripts

---

## 🏗️ Project Structure

```
studio-roster/
├── apps/api/          # NestJS backend
│   └── src/
│       ├── modules/   # Feature modules
│       ├── prisma/    # Database client
│       └── main.ts    # Entry point
├── components/        # React components
├── services/          # Frontend API layer
├── prisma/           # Database schema
├── build/            # Production build
└── deploy.sh         # Deployment script
```

---

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start dev server (backend + frontend)

# Building
npm run build            # Build all (API + frontend)
npm run build:api        # Build backend only

# Database
npx prisma migrate dev   # Local development - create and apply migrations
npx prisma migrate deploy # Production - apply existing migrations only
npx prisma generate      # Generate Prisma client

# Testing
npm run test             # Run backend tests (with Prisma client generation)
npm run test:frontend    # Run frontend tests

# Linting
npm run lint            # Check code quality
```

---

## 🚢 Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

Quick deployment to Google Cloud Run:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 Configuration

### Required Environment Variables

| Variable         | Description            | Example            |
| ---------------- | ---------------------- | ------------------ |
| `DATABASE_URL`   | Database connection    | `postgresql://postgres:postgres@localhost:5432/studio_roster?schema=public` |
| `JWT_SECRET`     | JWT signing key        | `<32-char-secret>` |
| `GCP_PROJECT_ID` | Google Cloud project   | `my-project-123`   |
| `ADMIN_EMAIL`    | Initial admin email    | `admin@studio.com` |
| `ADMIN_PASSWORD` | Initial admin password | `SecurePass123!`   |
| `SUPADATA_API_KEY` | Supadata transcription API key | `sd_xxx` |

### Optional Variables

| Variable         | Description      | Default       |
| ---------------- | ---------------- | ------------- |
| `PORT`           | Server port      | `3001`        |
| `NODE_ENV`       | Environment      | `development` |
| `GCP_LOCATION`   | Vertex AI region | `us-central1` |
| `STORAGE_BUCKET` | GCS bucket name  | -             |
| `LOG_LEVEL`      | Logging level    | `info`        |
| `VITE_API_URL`   | API base URL for SPA (set when API served from another host) | `http://localhost:3001/api/v1` |
| `SUPADATA_API_URL` | Supadata API base (optional override) | `https://api.supadata.ai` |

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[.env.example](./.env.example)** - Environment template
- **[walkthrough.md](./.gemini/antigravity/brain/.../walkthrough.md)** - Complete implementation details

---

## 🆘 Troubleshooting

### Database Connection Error

```bash
# Verify DATABASE_URL points to a reachable Postgres instance
# Reset local database (will drop data)
npx prisma migrate reset

# Apply migrations
npx prisma migrate dev      # Development
npx prisma migrate deploy   # Production/staging
```

### Build Errors

```bash
# Clean and reinstall
rm -rf node_modules build
npm install --legacy-peer-deps
npm run build
```

### Port Already in Use

```bash
# Change port in .env
PORT=3002
```

### Prisma Client Error

```bash
# Regenerate client
npx prisma generate
```

---

## ✅ Production Checklist

Before deploying:

- [ ] Generate strong JWT_SECRET
- [ ] Set secure ADMIN_PASSWORD
- [ ] Configure production DATABASE_URL
- [ ] Set up GCP service account
- [ ] Configure CORS for your domain
- [ ] Test authentication flow
- [ ] Verify Vertex AI access
- [ ] Review security settings

---

## 🎯 Key Features

### Authentication

- Email/password login
- JWT token-based sessions
- Bcrypt password hashing
- Auth guards on all protected routes

### AI Integration

- Vertex AI for content generation
- Gemini 1.5 Pro model
- Conversation history support
- Structured data extraction

### Database

- PostgreSQL compatible (uses SQLite locally)
- Prisma ORM
- Type-safe queries
- Automatic migrations

### API

- RESTful endpoints
- DTO validation
- Rate limiting
- Error handling
- Health checks

---

## 📖 Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [React Documentation](https://react.dev)

---

**Built with ❤️ using NestJS, React, Prisma, and Vertex AI**
