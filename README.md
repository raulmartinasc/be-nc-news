# API Documentation
This is the documentation for an API that provides users with access to reviews, comments, and user data, allowing them to view, create, update, and delete resources. Additionally, the API exposes endpoints for retrieving available resources.

# Hosted Version
This APi is currently hosted at: https://nc-news-api-mq3o.onrender.com

# Getting Started
1. Clone the repository
2. Install dependencies by running npm install
3. Create two new files, .env.development and .env.test, and add - - **PGDATABASE=NC_GAMES For the development environment and PGDATABASE=NC_GAMES_TEST for the test environment.**
4. Seed the database by running npm run seed
# Running the Tests
Run the tests by running npm test.

# Minimum Versions
Node.js version 10.0.0 or higher.
Postgres version 12.0.0 or higher.
# Endpoints
- GET /api
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- GET /api/users
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- DELETE /api/comments/:comment_id
# Author
Raul Martin.
# Contributing
If you would like to contribute to this project, please feel free to submit a pull request or contact me directly.
# Issues
If you encounter any issues while using this API, please report them through the project's Github issue tracker.
