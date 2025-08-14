#!/bin/bash

# Development Docker Script
set -e

echo "🐳 Starting MyMentor Development Environment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to stop and remove containers
cleanup() {
    echo "🧹 Cleaning up existing containers..."
    docker-compose -f docker-compose.dev.yml down -v
}

# Function to start development environment
start_dev() {
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d

    echo "⏳ Waiting for services to be ready..."
    sleep 10

    echo "📊 Services status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    npm run db:generate
    npm run db:push
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database..."
    npm run db:seed
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Function to stop development environment
stop_dev() {
    echo "🛑 Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
}

# Function to restart development environment
restart_dev() {
    echo "🔄 Restarting development environment..."
    stop_dev
    start_dev
}

# Function to show help
show_help() {
    echo "MyMentor Development Docker Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start development environment"
    echo "  stop      Stop development environment"
    echo "  restart   Restart development environment"
    echo "  logs      Show logs"
    echo "  migrate   Run database migrations"
    echo "  seed      Seed database"
    echo "  setup     Full setup (start + migrate + seed)"
    echo "  help      Show this help message"
    echo ""
    echo "Services:"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - PgAdmin: http://localhost:5050"
    echo "  - Redis: localhost:6379"
    echo "  - MailHog: http://localhost:8025"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        check_docker
        cleanup
        start_dev
        echo "✅ Development environment started!"
        echo "🌐 Access services at:"
        echo "   - PgAdmin: http://localhost:5050"
        echo "   - MailHog: http://localhost:8025"
        ;;
    stop)
        stop_dev
        echo "✅ Development environment stopped!"
        ;;
    restart)
        check_docker
        restart_dev
        echo "✅ Development environment restarted!"
        ;;
    logs)
        show_logs
        ;;
    migrate)
        run_migrations
        echo "✅ Database migrations completed!"
        ;;
    seed)
        seed_database
        echo "✅ Database seeded!"
        ;;
    setup)
        check_docker
        cleanup
        start_dev
        echo "⏳ Waiting for database to be ready..."
        sleep 15
        run_migrations
        seed_database
        echo "✅ Full setup completed!"
        echo "🌐 Access services at:"
        echo "   - PgAdmin: http://localhost:5050"
        echo "   - MailHog: http://localhost:8025"
        ;;
    help|*)
        show_help
        ;;
esac
