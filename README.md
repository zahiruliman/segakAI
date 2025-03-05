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
   ```

4. Set up the Supabase database
   Run the SQL in `lib/supabase-schema.sql` in your Supabase SQL editor to create the necessary tables and functions.

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## First-Time Admin Setup

To access the admin settings page and configure your app, you need to set up the first admin user. You have three options:

### Option 1: Using the Web UI
1. Create a regular user account through the sign-up page
2. After Supabase setup, set the admin password in the `app_config` table with the key `ADMIN_PASSWORD`
3. Go to the make-admin page at `/admin/make-admin` and enter:
   - The email of the user you want to make an admin
   - The admin password you set in step 2
4. Access the admin panel at `/admin`
5. Change the admin password and set your OpenAI API key

### Option 2: Using the Database Setup Script
1. Ensure your Supabase credentials are in `.env.local`
2. Run the database setup script:
   ```bash
   npm run setup-admin-db
   ```
3. This will create the necessary tables and set the default admin password to "change_this_immediately"

### Option 3: Using the Direct Admin User Setup Script
1. Add your Supabase service role key to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=your-key`
2. Create a regular user account through the sign-up page
3. Run the admin user setup script:
   ```bash
   npm run setup-admin-user
   ```
4. Enter the email of the user you want to make an admin
5. Access the admin panel at `/admin`

After setting up the admin user, you should:
1. Access the admin settings at `/admin`
2. Change the default admin password
3. Set your OpenAI API key

### Admin Settings

The admin settings page allows you to configure:
- OpenAI API Key
- Admin Password
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for providing the AI model
- Supabase for authentication and database services
- Vercel for hosting and deployment
- shadcn/ui for the component system
