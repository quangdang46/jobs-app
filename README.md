# Jobs App

A modern job board application built with Next.js 15, featuring a multi-tenant architecture supporting both job seekers and employers.

## Features

- **Job Seekers**: Browse and apply for job listings, manage resumes and applications
- **Employers**: Post and manage job listings, review applications
- **Authentication**: Secure authentication with Clerk including organization support
- **File Uploads**: Resume and document uploads via UploadThing
- **Background Jobs**: Asynchronous processing with Inngest
- **Real-time Updates**: Webhook integration for user and organization sync

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS 4
- **Authentication**: Clerk with organizations
- **Database**: PostgreSQL with Drizzle ORM
- **Background Jobs**: Inngest
- **File Uploads**: UploadThing
- **Styling**: TailwindCSS with Radix UI components via shadcn/ui
- **Email**: Resend for transactional emails

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- UploadThing account for file uploads

### Installation

1. Clone the repository:
```bash
git clone https://github.com/quangdang46/jobs-app.git
cd jobs-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in the required environment variables:
- Set up connecting database
    - `DATABASE_URL` - PostgreSQL connection string if using neon postgresql
    - If manual postgresql in local using docker compose and setup these variables
        -   `DB_HOST`
        -   `DB_PORT`
        -   `DB_USER`
        -   `DB_PASSWORD`
        -   `DB_NAME`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret
- `UPLOADTHING_TOKEN` - UploadThing API token
- `GEMINI_API_KEY` - Gemini API key visit [HERE](https://aistudio.google.com/apikey)

1. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```
1. Explore database:
```bash
npm run db:studio

```

6. Start the development servers:

In one terminal:
```bash
npm run dev
```

In another terminal (for background jobs):
```bash
npm run inngest
```

The application will be available at `http://localhost:8288`.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

### Database Operations
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

### Background Services
- `npm run inngest` - Start Inngest development server (required for webhooks)
- `npm run email` - Start email component development server

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (clerk)/           # Authentication routes
│   ├── (job-seeker)/      # Job seeker interface
│   └── employer/          # Employer dashboard
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   ├── jobListings/       # Job listing functionality
│   ├── users/             # User management
│   └── organizations/     # Organization management
├── drizzle/               # Database schema and migrations
├── services/              # External service integrations
└── utils/                 # Utility functions
```

### Route Architecture

- **`/(clerk)`** - Authentication routes (sign-in, organization selection)
- **`/(job-seeker)`** - Job seeker interface with parallel routes and sidebar
- **`/employer`** - Employer dashboard for managing job listings
- **`/api/inngest`** - Webhook endpoint for background job processing

## Key Features

### Multi-tenant Architecture
The application supports multiple user types with role-based access:
- Job seekers can browse listings and manage applications
- Employers can post jobs and manage applications
- Organizations provide context for employer activities

### Background Processing
Inngest handles asynchronous tasks including:
- User and organization webhook processing
- Email notifications
- Application status updates

### File Management
UploadThing integration provides:
- Resume uploads for job seekers
- Document management for applications
- Secure file storage and retrieval

## Development Guidelines

### Feature Organization
Features follow a consistent structure in `/src/features/`:
- `actions/` - Server actions and validation schemas
- `components/` - React components
- `db/` - Database queries and caching
- `lib/` - Utility functions

### Database Patterns
- Use Drizzle ORM for type-safe database operations
- Implement caching for frequently accessed data
- Follow the schema organization in `/src/drizzle/schema/`

### Authentication Flow
- Clerk handles authentication and organization management
- Webhooks sync user data via Inngest
- Middleware protects routes based on user roles

## Contributing

1. Follow the established project structure
2. Use the feature-based organization pattern
3. Implement proper TypeScript types
4. Add appropriate error handling
5. Test with both development servers running

## License

This project is private and proprietary.
