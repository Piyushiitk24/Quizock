# 📚 Quizock Teacher & Educator Guide

Welcome to **Quizock** - A comprehensive mathematics quiz platform designed for JEE, CUET, and NDA/NA exam preparation. This guide will help teachers, educators, and administrators effectively manage questions and monitor student progress.

## � First-Time Setup (For Beginners)

### What You Need to Know

Before starting, let's understand the basic components:

- **MongoDB**: A database where all questions, student data, and progress are stored (like a digital filing cabinet)
- **JWT Secret**: A secret password that keeps student login sessions secure
- **Session Secret**: Another security key for protecting user sessions
- **Admin Password**: The password teachers use to access the management panel
- **Environment Variables**: Configuration settings that tell the application how to run

### Step 1: Install Required Software

#### Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download and install the LTS (Long Term Support) version
3. Open terminal/command prompt and verify: `node --version`

#### Install MongoDB (Choose ONE option)

**Option A: Local Installation (Recommended for beginners)**
1. **Windows**: 
   - Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Run the installer with default settings
   - MongoDB will start automatically

2. **macOS**:
   ```bash
   # Install using Homebrew (recommended)
   brew tap mongodb/brew
   brew install mongodb-community
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

3. **Linux (Ubuntu/Debian)**:
   ```bash
   sudo apt update
   sudo apt install mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

**Option B: MongoDB Atlas (Cloud Database)**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 2: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your preferred text editor:

#### Understanding Each Setting:

```env
# Server Port (where your backend runs)
PORT=5000                    # Keep as 5000 unless you have conflicts

# Database Connection
MONGODB_URI=mongodb://localhost:27017/quizock    # For local MongoDB
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizock

# Security Keys (MUST CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
SESSION_SECRET=another_very_secure_random_string_for_sessions

# Admin Access (Change this!)
ADMIN_PASSWORD=SecureAdminPass123!
```

#### How to Generate Secure Keys:

**Method 1: Online Generator**
- Visit: [generate-secret.vercel.app/64](https://generate-secret.vercel.app/64)
- Copy the generated string

**Method 2: Using Terminal**
```bash
# Generate JWT Secret
openssl rand -base64 64

# Generate Session Secret  
openssl rand -base64 32
```

**Method 3: Manual Creation**
- Create random strings with letters, numbers, and symbols
- Make them at least 32 characters long
- Example: `Tr9#kL2$pX8@vN4&mQ7*wE1!zR5%yU6^`

### Step 3: Test Database Connection

1. **For Local MongoDB**:
   ```bash
   # Check if MongoDB is running
   mongosh    # This should connect without errors
   ```

2. **For MongoDB Atlas**:
   - Test connection string in MongoDB Compass or the Atlas web interface

### Step 4: Install and Start Application

1. **Install backend dependencies**:
   ```bash
   cd quiz-app/backend
   npm install
   ```

2. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Start the application**:
   ```bash
   # In one terminal (backend)
   cd quiz-app/backend
   npm start

   # In another terminal (frontend)  
   cd quiz-app/frontend
   npm start
   ```

### Step 5: First Login

1. Open browser to `http://localhost:3000`
2. Go to admin panel: `http://localhost:3000/admin`
3. Enter the `ADMIN_PASSWORD` you set in `.env`
4. You should see the admin dashboard!

### Common Issues and Solutions

#### "Cannot connect to MongoDB"
- **Local MongoDB**: Ensure MongoDB service is running
  ```bash
  # macOS
  brew services start mongodb/brew/mongodb-community
  
  # Windows: Start MongoDB service from Services panel
  # Linux
  sudo systemctl start mongodb
  ```

#### "Invalid JWT Secret"
- Make sure JWT_SECRET in `.env` is long and complex
- Restart the backend server after changing `.env`

#### "Admin login failed"
- Check ADMIN_PASSWORD in `.env` file
- Ensure no extra spaces or special characters

#### "Port already in use"
- Change PORT in `.env` to different number (e.g., 5001)
- Or find and stop the conflicting process

## �🔧 Admin Panel Access

### Accessing the Admin Panel
1. Navigate to your Quizock application URL
2. Add `/admin` to the URL (e.g., `http://localhost:3000/admin`)
3. Enter the admin password (set in your backend environment variables)
4. Access the comprehensive admin dashboard

### Admin Panel Features
- **Dashboard**: Overview of system statistics and student engagement
- **Question Management**: Add, edit, delete, and organize questions
- **Student Attempts**: Monitor student performance and progress
- **CSV Import**: Bulk import questions from spreadsheet files

## 📝 Question Management

### Adding Individual Questions

1. **Navigate to Questions Tab** in the admin panel
2. **Click "Add New Question"**
3. **Fill in the required fields:**
   - **Question Text**: Use LaTeX formatting for mathematical expressions
   - **Options**: Provide 4 multiple-choice options (A, B, C, D)
   - **Correct Answer**: Select the correct option
   - **Module**: Choose from available modules (trigonometry, algebra, etc.)
   - **Type**: Select question type (mock, revision)
   - **Difficulty**: Set difficulty level (easy, medium, hard)

### LaTeX Math Formatting

Quizock supports LaTeX rendering for mathematical expressions. Use the following syntax:

#### Basic Math Expressions
```latex
$x^2 + y^2 = z^2$                    // Inline math
$$\frac{a}{b} = \frac{c}{d}$$        // Display math
$\sin^2(θ) + \cos^2(θ) = 1$         // Trigonometric functions
$\sqrt{a^2 + b^2}$                   // Square roots
$\int_0^1 x^2 dx$                    // Integrals
```

#### Advanced Formatting
```latex
$\begin{bmatrix} a & b \\ c & d \end{bmatrix}$     // Matrices
$\lim_{x \to \infty} f(x)$                        // Limits
$\sum_{i=1}^{n} x_i$                              // Summations
$\alpha, \beta, \gamma, \theta, \phi$            // Greek letters
```

### Question Types

#### Revision Questions
- **Purpose**: Formula review and concept reinforcement
- **Format**: Question → Answer (no multiple choice)
- **Usage**: Students see the formula and must recall the answer
- **Timing**: 25 seconds per question

#### Mock Test Questions
- **Purpose**: Exam simulation and assessment
- **Format**: Multiple choice with 4 options
- **Usage**: Full test experience with scoring
- **Features**: Detailed results, time tracking, performance analytics

## 📊 CSV Import System

### Preparing Your CSV File

Create a CSV file with the following columns (header row required):

```csv
question,answer,option_a,option_b,option_c,option_d,correct_option,module,type,difficulty
"What is $\sin^2(A) + \cos^2(A)$?","1","0","1","2","$\sin(A)$","B","trigonometry","revision","easy"
"Solve: $\tan(45°)$","1","0","1","$\sqrt{2}$","$\frac{1}{\sqrt{2}}$","B","trigonometry","mock","easy"
```

#### Column Descriptions
- **question**: The main question text (supports LaTeX)
- **answer**: Correct answer for revision questions
- **option_a, option_b, option_c, option_d**: Multiple choice options
- **correct_option**: Letter of correct option (A, B, C, or D)
- **module**: Subject module (trigonometry, algebra, calculus, etc.)
- **type**: Question type (revision, mock)
- **difficulty**: Difficulty level (easy, medium, hard)

### CSV Import Process

1. **Prepare your CSV file** following the format above
2. **Access Admin Panel** → Questions Tab
3. **Click "Import from CSV"**
4. **Configure import settings:**
   - **Select CSV file** from your computer
   - **Choose target module** (trigonometry, algebra, etc.)
   - **Select question type** (revision or mock)
   - **Clear existing questions** (optional checkbox)
5. **Click "Import Questions"**
6. **Review import results** and any error messages

### CSV Import Best Practices

#### ✅ Do's
- Use proper LaTeX syntax for mathematical expressions
- Include header row with exact column names
- Test with small batches first (5-10 questions)
- Use UTF-8 encoding for special characters
- Escape commas in text with quotes ("text, with comma")

#### ❌ Don'ts
- Don't mix question types in one CSV file
- Don't use special characters without proper escaping
- Don't exceed 1000 questions per import
- Don't import without backing up existing data

### Sample CSV Templates

#### Trigonometry Revision Questions
```csv
question,answer,option_a,option_b,option_c,option_d,correct_option,module,type,difficulty
"$\sin(0°)$","0","","","","","","trigonometry","revision","easy"
"$\cos(90°)$","0","","","","","","trigonometry","revision","easy"
"$\tan(45°)$","1","","","","","","trigonometry","revision","easy"
```

#### Mathematics Mock Test Questions
```csv
question,answer,option_a,option_b,option_c,option_d,correct_option,module,type,difficulty
"What is $\sin(30°)$?","","$\frac{1}{2}$","$\frac{\sqrt{3}}{2}$","$\frac{1}{\sqrt{2}}$","1","A","trigonometry","mock","easy"
"Solve: $2x + 5 = 15$","","x = 5","x = 10","x = 7","x = 3","A","algebra","mock","easy"
```

## 📈 Student Progress Monitoring

### Dashboard Analytics
- **Total Students**: Number of registered users
- **Total Questions**: Questions in database by module
- **Attempts Today**: Daily engagement metrics
- **Average Scores**: Performance indicators

### Student Attempts Analysis
- **Filter by student**: Track individual progress
- **Filter by module**: Subject-wise performance
- **Filter by date range**: Time-period analysis
- **Export data**: Download progress reports

### Performance Metrics
- **Completion Rate**: Percentage of students completing quizzes
- **Average Score**: Mean performance across all attempts
- **Time Analysis**: Average time spent per question/quiz
- **Difficulty Trends**: Performance by question difficulty

## 🛠️ Technical Management

### Database Backup
```bash
# Backup MongoDB database
mongodump --db quizock --out ./backup/$(date +%Y%m%d)

# Restore from backup
mongorestore --db quizock ./backup/20250807/quizock
```

### Environment Configuration

**IMPORTANT**: Use the provided `.env.example` file as your starting point!

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your specific settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quizock
   ADMIN_PASSWORD=your_secure_admin_password
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   SESSION_SECRET=another_very_secure_random_string_for_sessions
   NODE_ENV=development
   ```

3. **Key Points**:
   - **Never share your `.env` file** - it contains sensitive passwords
   - **Generate secure random strings** for JWT_SECRET and SESSION_SECRET
   - **Use a strong ADMIN_PASSWORD** that only administrators know
   - **For production deployment**, change NODE_ENV to 'production'

4. **Security Best Practices**:
   - JWT_SECRET should be at least 64 characters long
   - Use different values for JWT_SECRET and SESSION_SECRET
   - Include letters, numbers, and special characters in secrets
   - Never commit the `.env` file to version control (it's in .gitignore)

For detailed setup instructions, see the "First-Time Setup" section above.

### Module Management
Current supported modules:
- **trigonometry**: Trigonometric functions and identities
- **algebra**: Algebraic equations and expressions
- **calculus**: Differential and integral calculus
- **geometry**: Coordinate and analytical geometry

To add new modules, update the backend schema and frontend dropdown options.

## 🎯 Best Practices for Educators

### Question Quality Guidelines
1. **Clear and Concise**: Write questions that are easy to understand
2. **Appropriate Difficulty**: Match difficulty to student level
3. **Relevant Context**: Use exam-style formatting (JEE, CUET, NDA)
4. **Mathematical Accuracy**: Verify all calculations and formulas
5. **Balanced Options**: Make incorrect options plausible but clearly wrong

### Student Engagement Strategies
1. **Regular Updates**: Add new questions weekly
2. **Difficulty Progression**: Start with easier questions, increase complexity
3. **Mixed Practice**: Combine revision and mock test formats
4. **Performance Feedback**: Review student progress regularly
5. **Motivational Elements**: Use the badge and streak system effectively

### Troubleshooting Common Issues

#### CSV Import Errors
- **"Invalid LaTeX syntax"**: Check mathematical expressions
- **"Missing required columns"**: Verify CSV header row
- **"Duplicate questions"**: Enable "clear existing" option
- **"File too large"**: Split into smaller batches

#### Student Issues
- **Login problems**: Check username format (no spaces/special chars)
- **LaTeX not rendering**: Refresh page, check browser compatibility
- **Progress not saving**: Verify stable internet connection

## 📞 Support and Updates

### Getting Help
- **Technical Issues**: Check server logs and database connectivity
- **Question Formatting**: Refer to LaTeX documentation
- **Feature Requests**: Submit through GitHub issues

### System Updates
- **Regular Backups**: Schedule weekly database backups
- **Software Updates**: Keep Node.js and MongoDB updated
- **Security**: Regularly update admin passwords

---

## 🚀 Quick Start Checklist

For new administrators:

- [ ] Access admin panel with credentials
- [ ] Import sample questions via CSV
- [ ] Test revision and mock quiz flows
- [ ] Monitor first student attempts
- [ ] Set up regular backup schedule
- [ ] Familiarize with LaTeX syntax
- [ ] Configure environment variables
- [ ] Review student progress weekly

**Happy Teaching! 🎓**

*Quizock - Empowering Mathematics Education for Competitive Exams*
