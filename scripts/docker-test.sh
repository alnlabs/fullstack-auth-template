#!/bin/bash

# Test Docker Script
set -e

echo "🧪 Starting MyMentor Test Environment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to stop and remove containers
cleanup() {
    echo "🧹 Cleaning up existing test containers..."
    docker-compose -f docker-compose.test.yml down -v
}

# Function to start test environment
start_test() {
    echo "🚀 Starting test environment..."
    docker-compose -f docker-compose.test.yml up -d

    echo "⏳ Waiting for services to be ready..."
    sleep 15

    echo "📊 Test services status:"
    docker-compose -f docker-compose.test.yml ps
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    docker-compose -f docker-compose.test.yml run --rm test-runner
}

# Function to show logs
show_logs() {
    echo "📋 Showing test logs..."
    docker-compose -f docker-compose.test.yml logs -f
}

# Function to stop test environment
stop_test() {
    echo "🛑 Stopping test environment..."
    docker-compose -f docker-compose.test.yml down
}

# Function to restart test environment
restart_test() {
    echo "🔄 Restarting test environment..."
    stop_test
    start_test
}

# Function to show help
show_help() {
    echo "MyMentor Test Docker Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start test environment"
    echo "  stop      Stop test environment"
    echo "  restart   Restart test environment"
    echo "  test      Run tests"
    echo "  logs      Show logs"
    echo "  setup     Full setup (start + test)"
    echo "  help      Show this help message"
    echo ""
    echo "Test Services:"
    echo "  - PostgreSQL: localhost:5433"
    echo "  - Redis: localhost:6380"
    echo "  - MailHog: http://localhost:8026"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        check_docker
        cleanup
        start_test
        echo "✅ Test environment started!"
        echo "🌐 Access test services at:"
        echo "   - MailHog: http://localhost:8026"
        ;;
    stop)
        stop_test
        echo "✅ Test environment stopped!"
        ;;
    restart)
        check_docker
        restart_test
        echo "✅ Test environment restarted!"
        ;;
    test)
        run_tests
        ;;
    logs)
        show_logs
        ;;
    setup)
        check_docker
        cleanup
        start_test
        echo "⏳ Waiting for services to be ready..."
        sleep 20
        run_tests
        echo "✅ Test setup completed!"
        ;;
    help|*)
        show_help
        ;;
esac
