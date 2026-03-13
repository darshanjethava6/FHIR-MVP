@echo off
echo Creating .env file for backend...
(
echo PORT=5000
echo MONGODB_URI=mongodb://localhost:27017/prior-auth-mvp
) > .env
echo .env file created successfully!
