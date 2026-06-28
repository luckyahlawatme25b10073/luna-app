# Luna 🌙 - Period Tracking Web App

A beautiful, feature-rich period tracking application built with love as a gift from boyfriend to girlfriend. Luna combines modern technology with thoughtful design to provide a comprehensive cycle tracking experience.

## Live Deployment

You can access the live deployed version of the application here:
👉 **[Luna 🌙 - Live App](https://luna-app-frontend.vercel.app/login)**

## Features

- **Cycle Tracking**: Log periods, symptoms, moods, and flow intensity
- **Predictions**: Accurate period and ovulation predictions based on your cycle history
- **Insights**: Visual charts and analytics to understand your cycle patterns
- **AI Assistant**: Get personalized advice and answers to your cycle-related questions
- **Partner Features**: Special sections for partners to show love and support (PIN-protected)
- **Beautiful Design**: Thoughtfully crafted UI with soothing colors and animations
- **Secure & Private**: Your data is encrypted and stored securely

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [GSAP](https://greensock.com/gsap/) - Advanced animations
- [React Query](https://tanstack.com/query/v4) - Data fetching and state management
- [React Hook Form](https://react-hook-form.com/) - Form validation
- [Zod](https://zod.dev/) - Schema validation
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Sonner](https://sonner.emilgoode.com/) - Toast notifications

### Backend
- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Prisma](https://www.prisma.io/) - ORM for PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Redis](https://redis.io/) - Caching and rate limiting
- [JSON Web Tokens](https://jwt.io/) - Authentication
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [Anthropic API](https://www.anthropic.com/) - AI assistant (Claude)
- [Helmet](https://helmetjs.github.io/) - Security headers
- [CORS](https://www.npmjs.com/package/cors) - Cross-origin resource sharing
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) - Rate limiting

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose (for containerized setup)
- OR PostgreSQL and Redis (for manual setup)

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository
2. Copy the example environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local  # If you have an example for frontend
   ```
3. Edit `.env` files to add your actual values:
   - **backend/.env**: Set `ANTHROPIC_API_KEY` to your actual Anthropic API key
   - **frontend/.env.local**: Typically just `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
5. The frontend will be available at [http://localhost:3000](http://localhost:3000)
6. The backend API will be available at [http://localhost:5000](http://localhost:5000)

### Option 2: Manual Setup

#### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in the values
4. Set up PostgreSQL and Redis (ensure they're running)
5. Run database migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`
7. The backend will run on [http://localhost:5000](http://localhost:5000)

#### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Start the development server: `npm run dev`
5. The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/luna?schema=public` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-super-secret-jwt-key-change-in-production` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `ANTHROPIC_API_KEY` | API key for Anthropic Claude | `your_anthropic_api_key_here` |
| `PORT` | Port to run the server | `5000` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Project Structure

```
luna-app/
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── middleware/     # Custom middleware (auth, rate limit, validation)
│   │   ├── routes/         # API route handlers
│   │   ├── lib/            # Database and service initialization
│   │   └── server.ts       # Express server entry point
│   ├── prisma/             # Prisma ORM configuration
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seed data
│   ├── Dockerfile          # Dockerfile for backend
│   ├── .env.example        # Example environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js frontend
│   ├── app/                # App router pages
│   │   ├── (dashboard)/    # Dashboard routes (protected)
│   │   ├── (auth)/         # Authentication routes (public)
│   │   └── ...             # Other routes
│   ├── components/         # React components
│   │   ├── love/           # Love section components (PIN-protected)
│   │   ├── ai/             # AI chat components
│   │   ├── settings/       # Settings components
│   │   ├── insights/       # Insights charts and components
│   │   ├── home/           # Home screen components
│   │   └── shared/         # Shared components (BottomNav, etc.)
│   ├── hooks/              # Custom React hooks
│   │   ├── useCycle.ts     # Cycle calculation hook
│   │   ├── useSettings.ts  # Settings hook
│   │   └── useLogs.ts      # Logs hook
│   ├── lib/                # Utility functions and helpers
│   │   ├── cycle-calculator.ts
│   │   ├── phase-data.ts
│   │   └── affirmations.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── Dockerfile          # Dockerfile for frontend
│   ├── .env.example        # Example environment variables
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user data
- `PUT /api/auth/me` - Update user profile

### Cycles
- `GET /api/cycles` - Get all cycles
- `POST /api/cycles` - Create a new cycle
- `GET /api/cycles/predictions` - Get cycle predictions

### Logs
- `GET /api/logs/:date` - Get log for a specific date
- `PUT /api/logs/:date` - Update or create log for a specific date
- `GET /api/logs?from=&to=` - Get logs in a date range
- `DELETE /api/logs/:date` - Delete log for a specific date

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update user settings

### AI Assistant
- `POST /api/ai/chat` - Send a message to the AI assistant

## Database Schema

### User
- id: String (UUID)
- email: String (unique)
- passwordHash: String
- name: String?
- profilePhoto: String?
- cycleLength: Int (default: 28)
- periodLength: Int (default: 5)
- lastPeriodStart: DateTime?
- anniversary: DateTime?
- lovePin: String? (4-digit PIN)
- apiKey: String? (encrypted Anthropic API key)
- createdAt: DateTime
- updatedAt: DateTime
- Relations: cycles[], logs[], settings?

### DailyLog
- id: String (UUID)
- userId: String
- date: DateTime (unique per user)
- flow: Int (0-4)
- mood: String (HAPPY, NEUTRAL, SAD, ANXIOUS, EXCITED, TIRED)
- symptoms: String[]
- energy: Int (1-5)
- pain: Int (0-5)
- weight: Float?
- sleep: Float?
- temperature: Float?
- notes: String?
- createdAt: DateTime
- updatedAt: DateTime

### Cycle
- id: String (UUID)
- userId: String
- startDate: DateTime
- endDate: DateTime?
- length: Int? (cycle length in days)
- notes: String?
- createdAt: DateTime
- updatedAt: DateTime

### Settings
- id: String (UUID)
- userId: String
- theme: String (default: "light")
- notifications: Json (e.g., { "reminders": true })
- createdAt: DateTime
- updatedAt: DateTime

## Deployment

### Production Build
To build the application for production:

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

### Production Start
Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

### Using Docker Compose for Production
```bash
docker-compose -f docker-compose.yml up --build -d
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Keep components small and focused
- Use Tailwind CSS for styling
- Follow the existing code patterns

### Database Migrations
When modifying the database schema:
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>`
3. Commit the migration files

### Testing
- Write unit tests for utility functions
- Write integration tests for API endpoints
- Use Jest and React Testing Library for frontend tests

## Acknowledgments

- Created with ❤️ as a gift from boyfriend to girlfriend
- Inspired by the beauty of natural cycles
- Built with the latest web technologies for optimal performance
- Thanks to all open-source projects used in this application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.