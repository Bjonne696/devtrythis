# Overview

Berge-Hyttene is a Norwegian cabin rental platform built with React and Vite. The application allows users to browse available cabins, make booking requests, and manage their properties. It's designed as a marketplace where cabin owners can list their properties and users can search and book accommodations. The platform includes user authentication, profile management, and a comprehensive booking system with review functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

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
- Booking requests and reservations
- Review and rating system
- Admin data for platform management

File storage is handled through Supabase Storage for user avatars and cabin images, with utility functions for generating public URLs.

## UI/UX Components
The design system includes reusable components for forms, modals, buttons, and data displays. Interactive features include date range pickers for booking, star rating components, interactive maps using Leaflet, and responsive grid layouts for cabin listings.

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