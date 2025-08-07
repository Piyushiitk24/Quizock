# 🔧 Environment Setup Guide for Beginners

This document explains how to set up your environment configuration for Quizock.

## What is an Environment File?

An environment file (`.env`) contains configuration settings that your application needs to run. Think of it as a settings file that tells your application:
- Where to find the database
- What passwords to use
- Which ports to run on

## Quick Setup Steps

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the new `.env` file** with your settings
3. **Never share your `.env` file** - it contains sensitive passwords!

## Understanding Each Setting

### Database Settings
- **MONGODB_URI**: Where your database is located
  - Local: `mongodb://localhost:27017/quizock`
  - Cloud: `mongodb+srv://username:password@cluster.mongodb.net/quizock`

### Security Settings
- **JWT_SECRET**: A long random string for login security
- **SESSION_SECRET**: Another random string for session security
- **ADMIN_PASSWORD**: Password teachers use to access admin panel

### Server Settings
- **PORT**: Which port your server runs on (usually 5000)

## Need Help?

- See the detailed setup guide in `TEACHER_GUIDE.md`
- For security key generation: [generate-secret.vercel.app](https://generate-secret.vercel.app/64)
- For MongoDB setup: See "First-Time Setup" in TEACHER_GUIDE.md
