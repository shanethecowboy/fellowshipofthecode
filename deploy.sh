#!/usr/bin/env bash
set -euo pipefail

# --- Configuration ---
INSTANCE_IP="3.222.89.230"
KEY_PATH="$HOME/.ssh/LightsailDefaultKey-us-east-1.pem"
APP_USER="ubuntu"
APP_DIR="/opt/fellowship"
SERVICE_NAME="fellowship"

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
BUILD_DIR="$PROJECT_ROOT/build"

SSH_OPTS="-o StrictHostKeyChecking=no -i $KEY_PATH"

# --- Helper functions ---
info()  { echo "[INFO]  $*"; }
error() { echo "[ERROR] $*" >&2; exit 1; }

remote() { ssh $SSH_OPTS "$APP_USER@$INSTANCE_IP" "$@"; }

# --- Step 1: Build frontend ---
build_frontend() {
    info "Building frontend..."
    cd "$FRONTEND_DIR"
    npm ci
    npm run build
    cd "$PROJECT_ROOT"
}

# --- Step 2: Build Go backend (cross-compile for Linux amd64) ---
build_backend() {
    info "Building Go backend for Linux amd64..."
    mkdir -p "$BUILD_DIR"
    cd "$BACKEND_DIR"
    GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o "$BUILD_DIR/server" .
    cd "$PROJECT_ROOT"
}

# --- Step 3: Prepare build artifacts ---
prepare_artifacts() {
    info "Preparing build artifacts..."
    rm -rf "$BUILD_DIR/static"
    cp -r "$FRONTEND_DIR/dist" "$BUILD_DIR/static"
}

# --- Step 4: Deploy to instance ---
deploy() {
    info "Deploying to $INSTANCE_IP..."

    # Create app directory on remote
    remote "sudo mkdir -p $APP_DIR && sudo chown $APP_USER:$APP_USER $APP_DIR"

    # Copy binary and static files
    scp $SSH_OPTS "$BUILD_DIR/server" "$APP_USER@$INSTANCE_IP:$APP_DIR/server"
    scp $SSH_OPTS -r "$BUILD_DIR/static" "$APP_USER@$INSTANCE_IP:$APP_DIR/"

    # Make binary executable and grant port 80 capability
    remote "chmod +x $APP_DIR/server && sudo setcap 'cap_net_bind_service=+ep' $APP_DIR/server"

    # Create systemd service
    remote "sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null" <<EOF
[Unit]
Description=Fellowship of the Code
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/server
Environment=PORT=80
Environment=STATIC_DIR=$APP_DIR/static
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    # Enable and start the service
    remote "sudo systemctl daemon-reload && sudo systemctl enable $SERVICE_NAME && sudo systemctl restart $SERVICE_NAME"

    sleep 2
    info "Deployment complete!"
    info "Site is live at: http://$INSTANCE_IP"
    info "Health check: http://$INSTANCE_IP/health"
}

# --- Main ---
case "${1:-all}" in
    build)
        build_frontend
        build_backend
        prepare_artifacts
        info "Build complete. Artifacts in $BUILD_DIR/"
        ;;
    deploy)
        deploy
        ;;
    all)
        build_frontend
        build_backend
        prepare_artifacts
        deploy
        ;;
    *)
        echo "Usage: $0 {build|deploy|all}"
        echo ""
        echo "  build   - Build frontend and backend"
        echo "  deploy  - Deploy artifacts to instance"
        echo "  all     - Build and deploy (default)"
        exit 1
        ;;
esac
