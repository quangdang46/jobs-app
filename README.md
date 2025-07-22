# Jobs App

A modern job board application built with Next.js 15, featuring a multi-tenant architecture supporting both job seekers and employers.

## Features

### 🎯 Core Platform Features
- ✅ **Multi-tenant Authentication**: Secure authentication with Clerk including organization support
- ✅ **Organization Management**: Role-based access with automatic membership sync
- ✅ **Responsive Design**: Mobile-first design optimized for all devices
- ✅ **Real-time Updates**: Webhook integration for user and organization sync

### 💼 Job Management (Employers)
- ✅ **Job Listing CRUD**: Complete job posting management with rich markdown editor
- ✅ **Job Status Management**: Draft, published, and delisted status transitions
- ✅ **Featured Job Listings**: Premium job highlighting with plan-based restrictions
- ✅ **Pricing Plans Integration**: Multi-tier pricing with Clerk Pricing Table
- ✅ **Plan-based Restrictions**: Feature limits based on subscription level
- ❌ **Job Templates**: Pre-built job description templates by industry
- ❌ **Job Expiry Management**: Automatic job expiration and renewal reminders
- ❌ **Company Profile Page**: Detailed company information and job listings page

### 🔍 Job Discovery (Job Seekers)
- ✅ **Advanced Job Browse**: Filter and search job listings with detailed views
- ✅ **AI-Powered Job Search**: Natural language search using Gemini AI
- ✅ **Job Listing Favorites**: Save and manage preferred job listings
- ❌ **Salary Range Filtering**: Filter jobs by salary and compensation range
- ❌ **Location-based Search**: Search jobs by city, state, or remote options
- ❌ **Job Categories**: Browse jobs by industry and job categories
- ❌ **Recently Viewed Jobs**: Track and revisit recently viewed job listings

### 📋 Application Management
- ✅ **Job Application Submission**: Apply with cover letters and resume upload
- ✅ **Application Tracking**: Comprehensive dashboard with stage management
- ✅ **Application Rating System**: 5-star rating system for candidate evaluation
- ✅ **AI Application Ranking**: Automatic candidate ranking using AI analysis
- ✅ **Optimistic UI Updates**: Smooth real-time stage and rating updates
- ❌ **Application Notes**: Add notes and comments to candidate applications
- ❌ **Application Status Updates**: Email notifications when application status changes
- ❌ **Candidate Shortlisting**: Create and manage candidate shortlists
- ❌ **Application Export**: Export application data to CSV/Excel

### 📄 Resume & Profile Management
- ✅ **Resume Upload**: Secure PDF resume upload via UploadThing
- ✅ **AI Resume Analysis**: Automatic parsing and summary generation
- ✅ **Markdown Resume Summaries**: Beautiful AI-generated profile summaries
- ❌ **Multiple Resume Upload**: Upload and manage multiple resumes
- ❌ **Profile Completeness**: Progress indicator for profile completion
- ❌ **Skills Tagging**: Add and manage skill tags for better job matching
- ❌ **Work Experience Timeline**: Visual timeline of work experience

### 🤖 AI & Automation Features
- ✅ **AI Job Search**: Gemini 2.0 Flash-powered natural language search
- ✅ **AI Application Ranking**: Automated candidate scoring and ranking
- ✅ **AI Resume Analysis**: Intelligent resume parsing with Gemini 2.5 Flash
- ✅ **AI-filtered Email Notifications**: Smart daily job alerts
- ❌ **Job Recommendation Engine**: Suggest relevant jobs to candidates
- ❌ **Auto Job Matching**: Match candidates to suitable job openings
- ❌ **Resume Keyword Optimization**: Suggest keywords to improve resume visibility
- ❌ **Automated Email Responses**: Template-based email responses for applications

### 📧 Communication & Notifications
- ✅ **Daily Job Alerts**: Automated email notifications for job seekers
- ✅ **Daily Application Alerts**: Employer notifications for new applications
- ✅ **Granular Notification Settings**: User-customizable notification preferences
- ✅ **Organization Notification Settings**: Team-based notification management
- ❌ **Email Templates**: Pre-built email templates for common communications
- ❌ **Application Confirmation Emails**: Automatic confirmation when jobs are applied
- ❌ **Weekly Job Summary**: Weekly digest of new job postings
- ❌ **Browser Push Notifications**: Real-time notifications for new applications

### 📊 Analytics & Reporting
- ✅ **Advanced Data Tables**: Sortable, filterable application management
- ✅ **Application Analytics**: Track application stages and ratings
- ❌ **Job Performance Analytics**: Track views, applications, and conversion rates
- ❌ **Application Statistics**: Charts showing application trends over time
- ❌ **Popular Jobs Report**: Most viewed and applied jobs analytics
- ❌ **User Activity Dashboard**: Track user engagement and activity
- ❌ **Monthly Reports**: Automated monthly summary reports

### 🔧 Advanced Platform Features
- ✅ **Background Job Processing**: Robust Inngest integration for scalability
- ✅ **Webhook Processing**: Automated user and organization sync
- ✅ **File Management**: Secure document storage and processing
- ✅ **Markdown Support**: Rich text editing for job descriptions
- ❌ **Search Filters**: Advanced filtering by experience level, job type, etc.
- ❌ **Job Alerts Management**: Manage and customize job alert preferences
- ❌ **Data Export**: Export job and application data to common formats
- ❌ **Backup & Recovery**: Automated data backup and recovery system

### 🌟 Additional Features
- ❌ **Job Sharing**: Share job postings on social media platforms
- ❌ **Candidate Database**: Search and manage candidate database
- ❌ **Interview Scheduling**: Basic calendar integration for interviews
- ❌ **Reference Checks**: Manage and track candidate references
- ❌ **Job Posting Templates**: Save and reuse job posting templates
- ❌ **Bulk Actions**: Perform bulk operations on applications and jobs
- ❌ **Custom Fields**: Add custom fields to job postings and applications
- ❌ **Application Deadlines**: Set and manage application deadlines

## Tech Stack

### Frontend & UI
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: TailwindCSS 4 with Radix UI components via shadcn/ui
- **Components**: Custom component library with variants and animations
- **Editor**: MDX Editor for rich markdown content creation
- **Tables**: Advanced data tables with sorting, filtering, and pagination

### Backend & Database
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis-style caching with tagged invalidation
- **Migrations**: Drizzle Kit for database schema management
- **Background Jobs**: Inngest for scalable job processing
- **Webhooks**: Svix for webhook verification and processing

### Authentication & Security
- **Authentication**: Clerk with multi-tenant organization support
- **Authorization**: Role-based access control with middleware protection
- **Pricing**: Clerk Pricing Table integration for subscription management
- **File Security**: UploadThing for secure file uploads and storage

### AI & Automation
- **AI Platform**: Google Gemini 2.0/2.5 Flash for intelligent features
- **Use Cases**: Job search, resume analysis, application ranking, email filtering
- **Processing**: Automated background AI jobs with error handling
- **Integration**: Seamless AI workflow integration throughout the platform

### Communication & Notifications
- **Email Service**: Resend with React Email components
- **Templates**: Beautiful HTML email templates with Tailwind styling
- **Scheduling**: Cron-based daily notification system
- **Personalization**: AI-powered content filtering and customization

### Development & Deployment
- **Language**: TypeScript for type safety
- **Validation**: Zod schemas for runtime type checking
- **State Management**: React hooks with optimistic updates
- **Performance**: Turbopack for fast development builds
- **Code Quality**: ESLint with Next.js configuration

## Current Status

🚀 **Production Ready**: This application features **25+ completed features** including advanced AI integrations, comprehensive user management, and enterprise-grade functionality.

### Key Highlights
- **Advanced AI Integration**: Multiple Gemini AI implementations for search, ranking, and analysis
- **Enterprise Features**: Multi-tenant architecture with subscription management
- **Modern Tech Stack**: Latest Next.js 15, React 19, and cutting-edge tools
- **Scalable Architecture**: Background job processing and caching for performance
- **Comprehensive Testing**: Feature-complete with production-ready code quality

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- UploadThing account for file uploads
- Inngest account for background jobs

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

The application will be available at `http://localhost:3000`.

## Deployment to Production

### Vercel Deployment

1. Deploy to Vercel:
```bash
vercel --prod
```

### Inngest Production Setup

**Important:** Inngest has separate environments (Development/Production). When deploying to production, you need to:

#### Step 1: Create Production App in Inngest
1. **Inngest Dashboard** → **Apps** → **Create App**
2. **App URL**: `https://your-domain.vercel.app/api/inngest`
3. **Environment**: Select **Production**

#### Step 2: Get Production Keys
1. **Inngest Dashboard** → **Settings** → **Keys**
2. Make sure you're in **Production** environment (check top-left dropdown)
3. Copy:
   - **Signing Key**: `signkey-prod-xxx...`
   - **Event Key**: `xxx...`

#### Step 3: Update Vercel Environment Variables
**Vercel Dashboard** → Project Settings → **Environment Variables**:
```env
INNGEST_SIGNING_KEY=signkey-prod-xxx...
INNGEST_EVENT_KEY=xxx...
```

#### Step 4: Update Clerk Webhooks
**Critical:** Update webhook URLs from development to production:

1. **Clerk Dashboard** → **Webhooks**
2. Find existing webhook (previously pointing to `http://localhost:3000/api/inngest`)
3. **Edit** webhook URL to: `https://your-domain.vercel.app/api/inngest`
4. **Copy the new webhook secret**
5. Update `CLERK_WEBHOOK_SECRET` in Vercel environment variables

#### Step 5: Redeploy
```bash
vercel --prod
```

### Common Issues

**Authentication Failed Error:**
- Ensure you're using Production environment keys from Inngest
- Verify `CLERK_WEBHOOK_SECRET` matches the production webhook secret
- Check that webhook URL points to production domain, not localhost

**Webhook Not Triggering:**
- Confirm Clerk webhook URL is updated to production
- Verify `CLERK_WEBHOOK_SECRET` environment variable is correct
- Test webhook delivery in Clerk Dashboard

### Verification
After deployment, verify:
1. Visit `https://your-domain.vercel.app/api/inngest` - should return JSON with function count
2. **Inngest Dashboard** → **Functions** - should show all 14 functions
3. Create a test user in Clerk - should trigger webhook events in Inngest

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
