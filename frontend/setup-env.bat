@echo off
echo Creating .env file for frontend...
(
echo VITE_API_URL=http://localhost:5000
) > .env
echo .env file created successfully!
