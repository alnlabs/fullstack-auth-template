#!/bin/bash

# Production Docker Script
set -e

echo "🚀 Starting MyMentor Production Environment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check environment file
check_env() {
    if [ ! -f .env.production ]; then
        echo "❌ .env.production file not found!"
        echo "Please copy env.production to .env.production and fill in your values."
        exit 1
    fi
}

# Function to build production images
build_prod() {
    echo "🔨 Building production images..."
    docker-compose -f docker-compose.prod.yml build
}

# Function to start production environment
start_prod() {
    echo "🚀 Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d

    echo "⏳ Waiting for services to be ready..."
    sleep 30

    echo "📊 Production services status:"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to show logs
show_logs() {
    echo "📋 Showing production logs..."
    docker-compose -f docker-compose.prod.yml logs -f
}

# Function to stop production environment
stop_prod() {
    echo "🛑 Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
}

# Function to restart production environment
restart_prod() {
    echo "🔄 Restarting production environment..."
    stop_prod
    start_prod
}

# Function to scale application
scale_app() {
    local replicas=${1:-2}
    echo "📈 Scaling application to $replicas replicas..."
    docker-compose -f docker-compose.prod.yml up -d --scale app=$replicas
}

# Function to backup database
backup_db() {
    echo "💾 Creating database backup..."
    docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Database backup created!"
}

# Function to show monitoring
show_monitoring() {
    echo "📊 Monitoring URLs:"
    echo "   - Prometheus: http://localhost:9090"
    echo "   - Grafana: http://localhost:3001"
    echo ""
    echo "📋 Application logs:"
    docker-compose -f docker-compose.prod.yml logs app
}

# Function to show help
show_help() {
    echo "MyMentor Production Docker Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start production environment"
    echo "  stop      Stop production environment"
    echo "  restart   Restart production environment"
    echo "  build     Build production images"
    echo "  logs      Show logs"
    echo "  scale     Scale application (default: 2 replicas)"
    echo "  backup    Create database backup"
    echo "  monitor   Show monitoring information"
    echo "  deploy    Full deployment (build + start)"
    echo "  help      Show this help message"
    echo ""
    echo "Production Services:"
    echo "  - Application: http://localhost:3000"
    echo "  - Nginx: http://localhost:80, https://localhost:443"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3001"
    echo ""
    echo "Environment:"
    echo "  - Make sure .env.production is configured"
    echo "  - Ensure SSL certificates are in ./nginx/ssl/"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        check_docker
        check_env
        start_prod
        echo "✅ Production environment started!"
        ;;
    stop)
        stop_prod
        echo "✅ Production environment stopped!"
        ;;
    restart)
        check_docker
        check_env
        restart_prod
        echo "✅ Production environment restarted!"
        ;;
    build)
        check_docker
        build_prod
        echo "✅ Production images built!"
        ;;
    logs)
        show_logs
        ;;
    scale)
        local replicas=${2:-2}
        scale_app $replicas
        echo "✅ Application scaled to $replicas replicas!"
        ;;
    backup)
        backup_db
        ;;
    monitor)
        show_monitoring
        ;;
    deploy)
        check_docker
        check_env
        build_prod
        start_prod
        echo "✅ Production deployment completed!"
        ;;
    help|*)
        show_help
        ;;
esac
