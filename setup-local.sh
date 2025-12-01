#!/bin/bash
# setup-local.sh - Local development setup script

echo "🔧 Studio Roster - Local Development Setup"
echo "=========================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    
    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    echo "🔑 Generated JWT_SECRET: $JWT_SECRET"
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    else
        # Linux
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    fi
    
    echo "✅ .env file created with generated secrets"
    echo ""
    echo "⚠️  Important: Update the following in .env:"
    echo "  - DATABASE_URL (currently using local SQLite)"
    echo "  - GCP_PROJECT_ID (your Google Cloud project)"
    echo "  - STORAGE_BUCKET (your GCS bucket name)"
    echo "  - ADMIN_PASSWORD (change from default)"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "  1. Review and update .env file"
echo "  2. Start development server: npm run dev"
echo "  3. Visit http://localhost:5173"
echo "  4. Default admin login: admin@studio.com (check ADMIN_PASSWORD in .env)"
echo ""
