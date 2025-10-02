# Overview

Berge-Hyttene is a Norwegian cabin rental platform built with React and Vite. The application allows users to browse available cabins, make booking requests, and manage their properties. It's designed as a marketplace where cabin owners can list their properties and users can search and book accommodations. The platform includes user authentication, profile management, and a comprehensive booking system with review functionality.

# Setup Instructions

## Required Environment Variables

This application requires Supabase credentials to function. Add the following environment variables in the Secrets tool (🔒 icon in the left sidebar):

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

To get these values:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy the Project URL and anon/public key

## Required Database Setup

**IMPORTANT:** The following SQL commands must be run in Supabase SQL Editor for the booking system to work correctly:

1. **Fix booking overlap trigger** (prevents UUID/integer type mismatch):
```sql
CREATE OR REPLACE FUNCTION public.check_booking_overlap()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM booking_requests 
    WHERE cabin_id = NEW.cabin_id 
      AND status = 'approved'
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND (NEW.start_date, NEW.end_date) OVERLAPS (start_date, end_date)
  ) THEN
    RAISE EXCEPTION 'Booking overlapper med eksisterende booking';
  END IF;
  RETURN NEW;
END;
$function$;
```

2. **Prevent duplicate pending requests** (prevents spam/race conditions):
```sql
CREATE UNIQUE INDEX unique_pending_booking_per_user 
ON booking_requests (cabin_id, user_id, start_date, end_date) 
WHERE status = 'pending';
```

3. **Limit pending requests to 2 per user per cabin** (prevents spam):
```sql
CREATE OR REPLACE FUNCTION public.check_pending_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  pending_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO pending_count
  FROM booking_requests
  WHERE cabin_id = NEW.cabin_id
    AND user_id = NEW.user_id
    AND status = 'pending'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  FOR UPDATE;
  
  IF pending_count >= 2 THEN
    RAISE EXCEPTION 'Du kan maks ha 2 aktive forespørsler for samme hytte'
      USING ERRCODE = 'P0001';
  END IF;
  
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS check_pending_limit_trigger ON booking_requests;
CREATE TRIGGER check_pending_limit_trigger
  BEFORE INSERT OR UPDATE ON booking_requests
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION check_pending_limit();
```

## Running the Application

The application is configured to run automatically with the workflow. It will start on port 5000 and be accessible through the Replit webview.

# User Preferences

Preferred communication style: Simple, everyday language.

**Important:** This is a development-only folder. Do NOT publish/deploy from this Repl. The user will copy code to a production folder when ready.

# System Architecture

## Frontend Architecture
The application uses React 19 with Vite as the build tool, providing fast development and optimal production builds. The component architecture follows modern React patterns with functional components and hooks. Styling is implemented using styled-components for component-scoped CSS-in-JS, with a comprehensive design system organized in the styles/common directory.

The routing system uses React Router v7 for client-side navigation between pages like home, cabin listings, user profiles, and admin panels. The application includes responsive design patterns optimized for desktop and mobile devices.

## Authentication & User Management
User authentication is handled through Supabase Auth, providing secure sign-up, sign-in, and session management. The system supports user profiles with avatar uploads, personal information management, and role-based access control for cabin owners and administrators.

## Data Management
The application uses Supabase as the primary backend service, providing PostgreSQL database functionality through a REST API. Key data entities include:
- User profiles with personal information and avatar storage
- Cabin listings with detailed property information, images, and pricing
- Booking requests and reservations (with two-layer overlap validation)
- Review and rating system
- Admin data for platform management

File storage is handled through Supabase Storage for user avatars and cabin images, with utility functions for generating public URLs.

### Booking System & Validation
The booking system implements comprehensive multi-layer validation:

**1. Frontend Validation (UX layer)**
- Fetches approved bookings and disables occupied dates in the date picker
- Client-side overlap checking before submission
- Checks for duplicate pending requests from the same user before submission
- Shows user-friendly error messages in Norwegian

**2. Database Validation (Security layer)**
- **Overlap prevention**: PostgreSQL trigger (`prevent_booking_overlap`) runs `check_booking_overlap()` function on INSERT/UPDATE to prevent conflicting approved bookings
- **Duplicate prevention**: Unique index (`unique_pending_booking_per_user`) prevents multiple pending requests from same user with identical dates for same cabin
- **Spam prevention**: PostgreSQL trigger (`check_pending_limit_trigger`) limits users to maximum 2 pending requests per cabin, preventing spam
- Frontend gracefully handles constraint violations with appropriate user messages (error codes 23505, P0001)

All database IDs use UUID type (cabins.id, booking_requests.id, booking_requests.cabin_id). Booking statuses: 'pending', 'approved', 'rejected' - only 'approved' bookings block dates from other users.

## UI/UX Components
The design system includes reusable components for forms, modals, buttons, and data displays. Interactive features include date range pickers for booking, star rating components, interactive maps using Leaflet, and responsive grid layouts for cabin listings.

### Navigation System
The application features an optimized, single-bar navigation system (Navigation.jsx) that combines logo, navigation links, and authentication controls in one compact header:

**Desktop Layout:**
- Left: Compact logo (50px height)
- Center: Horizontal navigation links (Hjem, Til leie, Nye Hytter, Populære, Kontakt, Om oss)
- Right: Login/Logout button
- Conditional links: "Min Profil" (logged-in users), "Admin" (admin role only)
- Active route highlighting with background color
- Total height: ~60px (50% reduction from previous two-bar layout)

**Mobile Layout (< 768px):**
- Logo on left, hamburger menu on right
- Expandable mobile menu with all navigation links + auth button
- Full-width touch targets for optimal mobile UX
- Menu auto-closes after navigation
- Auth controls accessible in mobile menu (Logg inn/Logg ut as last menu item)

The Navigation component replaced the previous dual-header system (LogoHeader + Header), reducing vertical space usage and improving user experience across all device sizes.

## State Management
The application uses React's built-in state management with hooks (useState, useEffect) for component-level state. Data fetching is handled through custom hooks and utility functions that interact with the Supabase client.

# External Dependencies

## Backend Services
- **Supabase**: Primary backend-as-a-service providing PostgreSQL database, authentication, real-time subscriptions, and file storage
- **Supabase Storage**: Object storage for user avatars and cabin images

## Frontend Libraries
- **React 19**: Core UI framework with latest features
- **React Router v7**: Client-side routing and navigation
- **styled-components**: CSS-in-JS styling solution
- **React Icons**: Comprehensive icon library
- **Leaflet & React-Leaflet**: Interactive maps for cabin locations
- **react-date-range**: Date picker component for booking functionality
- **date-fns**: Date manipulation and formatting utilities
- **uuid**: Unique identifier generation

## Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting with React-specific rules
- **Globals**: Browser globals for ESLint configuration

## External APIs
The application integrates with Supabase's REST API for all data operations, including CRUD operations for cabins, bookings, users, and reviews. Error logs indicate the system makes HTTP requests to `ujvmqqnhkrustkgdvsfa.supabase.co` for data fetching operations.