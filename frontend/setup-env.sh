#!/bin/bash
echo "Creating .env file for frontend..."
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF
echo ".env file created successfully!"
