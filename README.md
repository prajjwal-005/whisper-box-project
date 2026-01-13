
# Whisper Box

Whisper Box is a full-stack anonymous messaging website built with **Next.js (App Router)** and **MongoDB**. It supports anonymous message delivery to user profiles and includes **automated content moderation**, **rate limiting**, and **basic abuse tracking** for safety.

---

## Features

### Messaging

* Public profile link for each user
* Anyone can send a message to a user without logging in
* Users can disable message receiving (`isAcceptingMessages`)

### Moderation Pipeline (Server-Side)

Incoming messages pass through a multi-stage moderation flow:

1. **Pre-screen checks (fast / local)**

   * Empty message blocking
   * Maximum length enforcement
   * Repeated-character spam detection
   * Hard-block regex detection (obfuscated profanity patterns)

2. **AI moderation**

   * Uses OpenAI Moderation API to classify content
   * Produces labels for: abusive, sexual, sexual harassment, threatening, spam

3. **Policy engine**

   * Maps labels → severity → action
   * Actions supported:

     * `ALLOW` (stored normally)
     * `WARN` (stored but flagged)
     * `BLUR` (stored but blurred in UI)
     * `HIDE` (stored but hidden in UI)
     * `BLOCK` (rejected and not stored)

### Abuse Tracking

* Violations are tracked per-IP using a strike counter stored in MongoDB.
* Repeat offenders are temporarily blocked.
* Enforcement is server-side and independent of the client UI.

### Rate Limiting

* Per-IP request limiting is applied on message sending.
* Threshold includes jitter to reduce predictability.

### Authentication & Verification

* Authentication handled via **NextAuth**
* Signup includes email verification using **Resend**
* Protected routes for dashboard pages

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Database:** MongoDB + Mongoose
* **Auth:** NextAuth
* **Email:** Resend
* **UI:** Tailwind CSS + shadcn/ui
* **Validation:** Zod
* **Moderation:** OpenAI Moderation API

---

## Project Structure

```text
Whisper-Box-project/
├── components.json           # Configuration for shadcn/ui components
├── eslint.config.mjs         # ESLint configuration for code linting
├── next.config.ts            # Next.js specific configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── emails/                   # Email templates for the application
│   └── VerificationEmail.tsx # React Email template for user verification
├── public/                   # Static assets (images, icons, svgs)
└── src/                      # Main application source code
    ├── middleware.ts         # NextAuth middleware for route protection
    ├── app/                  # Next.js App Router (pages and API routes)
    │   ├── layout.tsx        # Root layout for the entire application
    │   ├── globals.css       # Global CSS styles
    │   ├── (app)/            # Authenticated application routes
    │   │   ├── dashboard/    # User dashboard page
    │   │   ├── layout.tsx    # Layout for authenticated pages
    │   │   └── page.tsx      # Main landing/home page
    │   ├── (auth)/           # Authentication-related routes
    │   │   ├── sign-in/      # Sign-in page
    │   │   ├── sign-up/      # Sign-up page
    │   │   └── verify/       # Account verification page
    │   ├── api/              # Backend API endpoints
    │   │   ├── auth/         # NextAuth configuration and routes
    │   │   ├── send-message/ # Endpoint to receive anonymous messages
    │   │   ├── suggest-messages/ # AI-powered message suggestions
    │   │   └── ...           # Other utility APIs (delete, check-username, etc.)
    │   └── u/[username]/     # Public profile page for receiving messages
    ├── components/           # Reusable React components
    │   ├── Navbar.tsx        # Main navigation component
    │   ├── ui/               # Base UI components (shadcn/ui)
    │   └── ...               # Feature-specific components (MessageCard, ShareCard)
    ├── helpers/              # Helper functions
    │   └── sendEmailVerification.ts # Logic to send verification emails
    ├── lib/                  # Core library and utility configurations
    │   ├── dbConnect.ts      # MongoDB connection logic
    │   ├── moderation.ts     # Content moderation and AI logic
    │   └── questions.ts      # Static data for message prompts
    ├── model/                # Mongoose database models
    │   ├── User.model.ts     # User and Message schemas
    │   └── RateLimit.ts      # Schema for tracking API rate limits
    ├── schemas/              # Zod validation schemas
    │   ├── signupSchema.ts   # Validation for user registration
    │   └── messageSchema.ts  # Validation for incoming messages
    └── types/                # TypeScript type definitions
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URL=your_mongodb_connection_string

# Auth
AUTH_SECRET=your_nextauth_secret

# Email (Resend)
RESEND_API_KEY=re_your_api_key

# AI Moderation
OPENAI_API_KEY=your_openai_key
```

---


## Moderation Notes (Implementation Behavior)

Message moderation can result in:

* **Blocked:** message is rejected and not stored
* **Hidden:** stored but not shown by default
* **Blurred:** stored and shown with blur/cover behavior
* **Warned:** stored with a warning flag for review

Moderation decisions are made server-side inside the message send API route.

---


