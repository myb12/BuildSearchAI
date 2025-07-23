# AI Knowledge Base Application

## Project Overview

The AI Knowledge Base is a full-stack web application designed to help users manage and summarize articles using Artificial Intelligence. Users can securely log in, view their articles, and leverage AI capabilities to generate concise summaries of article content.

This project demonstrates a modern web development stack, including user authentication, API integration (with OpenAI for summarization), and responsive design.

## Features

* **User Authentication:** Secure login/logout functionality.
* **Article Management:** View, manage, and detail articles.
* **AI Summarization:** Generate concise summaries of article content using OpenAI's powerful language models.
* **Responsive Design:** Optimized for both desktop and mobile viewing.

## Technologies Used

* **Frontend:**
    * Next.js (React Framework)
    * TypeScript
    * Tailwind CSS (for styling)
* **Backend:**
    * Next.js API Routes
    * TypeScript
    * Node.js
    * OpenAI API (for summarization)
    * `jsonwebtoken` (for JWT handling)
    * `bcryptjs` (for password hashing - *assuming this is used in auth*)
    * Database (e.g., MongoDB with Mongoose, or Prisma, etc. - **Specify your actual database here if known**)

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/en/) (LTS version recommended, e.g., v18.x or v20.x)
* [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <your-repository-url>
cd ai-knowledgebase

### 2. Install Dependencies

Navigate to the project root directory and install all required Node.js dependencies:

```bash
npm install
# or
yarn install

### 3. Environment Variables

Create a `.env.local` file in the root of your project. This file will store sensitive information like API keys and database credentials.

You will need the following variables:

```env
# JWT Secret for token signing/verification (e.g., a long random string)
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API Key for summarization
OPENAI_API_KEY=your_openai_api_key_here

# Database Connection String (Example for MongoDB)
# Replace with your actual database connection string
DATABASE_URL=your_database_connection_string_here
*Important: Replace the placeholder values with your actual keys and connection strings.*
*Do not commit your .env.local file to version control.*

### 4. Database Setup (Optional/If Applicable)

If your project uses a database, you might need to run migrations or seed initial data.

**For MongoDB/Mongoose:**  
Typically no explicit migration is needed, but ensure your `DATABASE_URL` is correct.

**For Prisma:**

```bash
npx prisma migrate dev --name init
# Optional: Run the seed script if available
# npx prisma db seed
*Adjust based on your actual database ORM/setup.*

### 5. Run the Development Server

Once dependencies are installed and environment variables are set, you can start the development server:

```bash
npm run dev
# or
yarn dev
*The application will now be running at http://localhost:3000. Open this URL in your web browser to access the application.*

## Usage

- **Register/Login:** Navigate to the login page (`/login`) to create a new account or log in with existing credentials.
- **Dashboard:** After successful login, you will be redirected to the dashboard, where you can view your articles.
- **View Article Details:** Click on an article title to view its full content.
- **Summarize Article:** On the article detail page, click the "Summarize Article" button to generate an AI-powered summary.

## API Endpoints

A brief overview of the key API endpoints:

| Method | Endpoint                        | Description                                |
|--------|----------------------------------|--------------------------------------------|
| POST   | `/api/auth/login`               | User login                                 |
| POST   | `/api/auth/register`            | User registration                          |
| GET    | `/api/articles`                 | Retrieve all articles for the user         |
| GET    | `/api/articles/[id]`            | Retrieve a specific article by ID          |
| POST   | `/api/articles/[id]/summarize`  | Generate an AI summary for an article      |

## Deployment

This Next.js application can be easily deployed to platforms like **Vercel**:

1. Link your Git repository to [Vercel](https://vercel.com/).
2. Vercel will automatically detect it's a Next.js project and deploy it.
3. Set the required environment variables in Vercel's project settings:
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
