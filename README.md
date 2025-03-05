# SegakAI - Personalized Fitness and Diet Planning App

SegakAI is a modern web application that uses artificial intelligence to generate personalized fitness and diet plans based on user's individual characteristics, goals, and preferences.

## Features

- User authentication (sign up, login, logout)
- Multi-step form for collecting user information
- AI-powered generation of personalized workout and diet plans
- Dashboard to view and manage generated plans
- Admin settings panel for configuration

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS with shadcn/ui components
- Supabase for authentication and database
- OpenAI API for AI-powered plan generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/segakai.git
   cd segakai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Initialize the Supabase database
   ```bash
   npm run init-db
   ```
   This script will automatically create all necessary tables, functions, and initial data.

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

The admin settings page is only accessible to users with admin privileges:

1. Create a regular user account through the sign-up page
2. In the Supabase dashboard, navigate to Authentication > Users
3. Find your user and click "Edit"
4. Add `{"is_admin": true}` to the user's metadata
5. Save the changes
6. Access the admin panel at `/admin`
7. Set your OpenAI API key in the admin settings

### Admin Settings

The admin settings page allows you to configure:
- OpenAI API Key
- Other application settings

## Using the App

1. Sign up or log in
2. Complete the multi-step form with your personal information
3. The AI will generate a personalized fitness and diet plan
4. View your plan on the dashboard
5. Create new plans as needed

## Development

### Folder Structure

- `app/` - Next.js 15 app directory with all routes
- `components/` - Reusable React components
- `lib/` - Utility functions and shared code
- `public/` - Static assets

### Key Files

- `app/page.tsx` - Homepage
- `app/dashboard/page.tsx` - User dashboard
- `app/api/generate/route.ts` - AI plan generation endpoint
- `app/admin/page.tsx` - Admin settings page
- `lib/supabase-schema.sql` - Database schema
- `scripts/init-db.js` - Database initialization script

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for providing the AI model
- Supabase for authentication and database services
- Vercel for hosting and deployment
- shadcn/ui for the component system
