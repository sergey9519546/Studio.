#!/bin/bash
# Firebase Production Deployment Script
# Studio Roster Application

set -euo pipefail

# Configuration
PROJECT_ID="gen-lang-client-0704991831"
SITE_ID="gen-lang-client-0704991831-35466"
ENV_FILE=".env.production"
BUILD_DIR="build/client"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        log_error "Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    log_info "Setting up production environment..."
    
    # Check if production env file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Production environment file not found: $ENV_FILE"
        exit 1
    fi
    
    # Copy production environment to .env for build
    cp "$ENV_FILE" .env
    
    log_success "Environment setup complete"
}

# Build application
build_application() {
    log_info "Building application for production..."
    
    # Clean previous build
    rm -rf build/
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    # Run production build
    log_info "Running production build..."
    npm run build
    
    # Verify build artifacts
    if [[ ! -d "$BUILD_DIR" ]]; then
        log_error "Build directory not found: $BUILD_DIR"
        exit 1
    fi
    
    # Check for essential files
    if [[ ! -f "$BUILD_DIR/index.html" ]]; then
        log_error "Build failed: index.html not found"
        exit 1
    fi
    
    log_success "Application build complete"
}

# Validate Firebase configuration
validate_firebase_config() {
    log_info "Validating Firebase configuration..."
    
    # Check .firebaserc
    if [[ ! -f ".firebaserc" ]]; then
        log_error ".firebaserc file not found"
        exit 1
    fi
    
    # Check firebase.json
    if [[ ! -f "firebase.json" ]]; then
        log_error "firebase.json file not found"
        exit 1
    fi
    
    # Verify project ID
    if ! grep -q "$PROJECT_ID" .firebaserc; then
        log_warning "Project ID $PROJECT_ID not found in .firebaserc"
    fi
    
    log_success "Firebase configuration validation complete"
}

# Dry run deployment
dry_run_deployment() {
    log_info "Running dry run deployment..."
    
    # Test rules deployment
    if firebase deploy --only firestore:rules --dry-run; then
        log_success "Firestore rules validation passed"
    else
        log_error "Firestore rules validation failed"
        exit 1
    fi
    
    if firebase deploy --only storage --dry-run; then
        log_success "Storage rules validation passed"
    else
        log_error "Storage rules validation failed"
        exit 1
    fi
    
    log_success "Dry run deployment validation complete"
}

# Deploy to Firebase
deploy_to_firebase() {
    log_info "Deploying to Firebase..."
    
    # Deploy all services
    if firebase deploy; then
        log_success "Firebase deployment complete"
    else
        log_error "Firebase deployment failed"
        exit 1
    fi
    
    # Get deployment URL
    SITE_URL=$(firebase hosting:sites:get "$SITE_ID" --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    log_info "Deployment URL: $SITE_URL"
}

# Post-deployment validation
post_deployment_validation() {
    log_info "Running post-deployment validation..."
    
    # Test if site is accessible
    if curl -f -s "$SITE_URL" > /dev/null; then
        log_success "Site is accessible"
    else
        log_warning "Site may not be fully accessible yet (deployment in progress)"
    fi
    
    log_success "Post-deployment validation complete"
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."
    
    # Remove temporary .env file if it was created from production
    if [[ -f ".env" ]] && [[ ! -f ".env.local" ]]; then
        rm -f .env
    fi
    
    log_success "Cleanup complete"
}

# Main execution
main() {
    echo "=========================================="
    echo "Studio Roster - Firebase Production Deploy"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    setup_environment
    build_application
    validate_firebase_config
    dry_run_deployment
    deploy_to_firebase
    post_deployment_validation
    cleanup
    
    echo ""
    echo "=========================================="
    log_success "Production deployment completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Visit the deployed site and verify functionality"
    echo "2. Test authentication flows"
    echo "3. Verify database operations"
    echo "4. Monitor logs for any issues"
    echo ""
    echo "Deployment URL: $SITE_URL"
}

# Run main function
main "$@"
