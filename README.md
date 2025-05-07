# Form Filling Assistant

A modern web application that helps users fill out forms efficiently using AI assistance. The application consists of a Next.js frontend and a Node.js backend, with PostgreSQL as the database.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Quick Start ([Before running in production mode check Database Migrations](#database-migrations))

1. Clone the repository:
```bash
git clone https://github.com/yourusername/filling_form_assistent.git
cd filling_form_assistent
```

2. Set up your Google Gemini API key:
   - Open `docker-compose.yml`
   - Find the `GEMINI_API_KEY` environment variable in the backend service
   - [Link to Generate GEMINI_API_KEY](https://aistudio.google.com/apikey)
   - Replace the placeholder value with your actual API key

3. Start the application using Docker Compose:
```bash
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Database Migrations

Before running the application in production, you need to create the database tables. There are two ways to do this:

### Option 1: Using Development Mode First (Tested)
1. Temporarily change `NODE_ENV` to `development` in docker-compose.yml
2. Run `docker-compose up --build`
3. Once tables are created, change `NODE_ENV` back to `production`
4. Restart the containers

### Option 2: Using TypeORM CLI (Untested)
1. Install TypeORM CLI globally:
```bash
npm install -g typeorm
```

2. Generate migration files:
```bash
cd backend
npm run typeorm migration:generate -- -n InitialMigration
```

3. Run migrations:
```bash
npm run typeorm migration:run
```

## Application Functionality

### Main Features
1. **AI Assistant**
   - Start chatting with AI to get help with form filling
   - Type your question in the chat input
   - The AI will help you to fill form using questions
   - You can ask multiple questions about the same form

2. **Chat Interface**
   - Real-time chat with AI assistant
   - History of previous questions and answers
   - Ability to reference specific form fields in questions

3. **Header Buttons**
   - The *Reset* button lets you restart the conversation from the beginning. Keep in mind that this will erase all your current progress.
   - Theme change button allows you to change from light to dark theme or vice versa

## Project Structure

```
filling_form_assistent/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend application
├── docker-compose.yml # Docker configuration
└── README.md         # This file
```

## Features

- AI-powered form filling assistance
- Real-time form validation
- User-friendly interface
- Secure data handling
- PostgreSQL database for data persistence

## Environment Variables

The application uses the following environment variables:

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry
- `NODE_ENV`: Environment (production/development)

### Backend
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `NODE_ENV`: Environment (production/development)

## Development

To run the application in development mode on your PC:

1. Start only PostgreSQL:
```bash
docker-compose up postgres
```

2. For frontend development:
```bash
cd frontend
npm install
npm run dev
```

3. For backend development:
```bash
cd backend
npm install
npm run dev
```

## Database

The application uses PostgreSQL as its database. The database is automatically created and configured when you run `docker-compose up` with `NODE_ENV` set to `development`. Data is persisted in a Docker volume named `postgres_data`.

## Troubleshooting

If you encounter any issues:

1. Ensure all ports (3000, 3001, 5432) are available
2. Check Docker logs:
```bash
docker-compose logs
```
3. Verify environment variables are correctly set
4. Ensure you have sufficient disk space for the database volume

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
