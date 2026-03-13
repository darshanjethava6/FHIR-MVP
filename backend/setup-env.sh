#!/bin/bash
echo "Creating .env file for backend..."
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prior-auth-mvp
EOF
echo ".env file created successfully!"
