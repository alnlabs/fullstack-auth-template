#!/bin/bash

# MyMentor Authentication Template Setup Script
# This script helps you quickly set up the template for a new project

set -e

echo "🚀 Fullstack Authentication Template Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_status "Node.js $(node -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_status "Dependencies installed"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."

    if [ ! -f .env.local ]; then
        cp env.example .env.local
        print_status "Environment file created (.env.local)"
        print_warning "Please update .env.local with your configuration"
    else
        print_warning ".env.local already exists. Skipping..."
    fi
}

# Start development environment
start_dev_environment() {
    print_info "Starting development environment..."

    # Make scripts executable
    chmod +x scripts/*.sh

    # Start Docker services
    ./scripts/docker-dev.sh start

    print_status "Development environment started"
}

# Setup database
setup_database() {
    print_info "Setting up database..."

    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    sleep 10

    # Generate Prisma client
    npm run db:generate

    # Run migrations
    npm run db:migrate

    # Seed database
    npm run db:seed

    print_status "Database setup complete"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. 📝 Configure your environment variables in .env.local:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - Google OAuth credentials"
    echo "   - Firebase configuration"
    echo ""
    echo "2. 🔧 Update configuration files:"
    echo "   - Firebase setup (src/lib/firebase.ts)"
    echo "   - Google OAuth setup"
    echo ""
    echo "3. 🚀 Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "4. 📚 Read the documentation:"
    echo "   - TEMPLATE_SETUP.md - Complete setup guide"
    echo "   - API_ENDPOINTS.md - API documentation"
    echo "   - README.md - Project overview"
    echo ""
    echo "5. 🧪 Test the API endpoints:"
    echo "   - Use Postman or similar tool"
    echo "   - Check API_ENDPOINTS.md for examples"
    echo ""
    echo "6. 🎨 Start building your frontend:"
    echo "   - Create authentication UI"
    echo "   - Build user dashboard"
    echo "   - Implement file upload interface"
    echo ""
    echo "Default SuperAdmin credentials:"
    echo "Email: superadmin@mymentor.com"
    echo "Password: SuperAdmin123!"
    echo ""
    echo "Application will be available at: http://localhost:4800"
    echo ""
    echo "Happy coding! 🚀"
}

# Main setup function
main() {
    echo "Starting template setup..."
    echo ""

    # Run checks
    check_docker
    check_node

    # Install dependencies
    install_dependencies

    # Setup environment
    setup_environment

    # Start development environment
    start_dev_environment

    # Setup database
    setup_database

    # Show next steps
    show_next_steps
}

# Run main function
main "$@"
