# TaskKamba

> A modern task management application with Kanban board functionality, real-time synchronization, and daily streak tracking using Next.js, React, Firebase, and Tailwind CSS.

## Features

- **Kanban Board**: Intuitive drag-and-drop task management with multiple columns
- **Daily Streak Tracking**: Monitor your productivity consistency over time
- **Weekly Activity Chart**: Visual analytics of your task completion patterns
- **Google Authentication**: Secure login with Firebase Google provider
- **Real-time Sync**: Cloud-based task synchronization with Firestore
- **Modern UI**: Beautiful and responsive interface with Tailwind CSS
- **Accessible**: Built with accessibility best practices
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Google Authentication enabled
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ElGioVR/TaskKamba.git
cd TaskKamba
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.template` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.template .env.local
```

See [Firebase Setup](#firebase-setup) below for detailed instructions.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run testUnit` - Run unit tests with Vitest

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Google Authentication

1. Navigate to **Authentication** in your Firebase project
2. Click **Get started**
3. Select **Google** as a sign-in method
4. Enable it and add your project details

### 3. Create a Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **production mode** (we'll set security rules)

### 4. Set Security Rules

In the Firestore Database rules tab, add:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == userId;
    }

    match /users/{userId}/history/{historyId} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

### 5. Add Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Under **Your apps**, select or create a web app
3. Copy your Firebase config
4. Add these values to your `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
TaskKamba/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── features/
│   │   └── task-board/              # Task board feature
│   │       ├── TaskBoard.tsx        # Main component
│   │       ├── components/          # UI components
│   │       ├── hooks/               # Custom React hooks
│   │       ├── model/               # Business logic & selectors
│   │       └── __tests__/           # Unit tests
│   └── lib/
│       └── firebase.ts              # Firebase configuration
├── .env.template                     # Environment variables template
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.mjs              # Tailwind CSS configuration
├── vitest.config.mts                # Vitest configuration
└── package.json                     # Project dependencies
```

## Architecture

### Features-Based Structure

The project uses a feature-based architecture for better scalability and maintainability:

- **Components**: Presentational React components with UI logic
- **Hooks**: Custom React hooks for reusable component logic
- **Model**: Business logic, state selectors, and data transformations
- **Tests**: Unit tests for critical functionality

### Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with server-side capabilities |
| **React 19** | UI library with latest features and hooks |
| **Firebase** | Authentication, Firestore database, cloud storage |
| **dnd-kit** | Accessible drag-and-drop library for Kanban board |
| **Tailwind CSS** | Utility-first CSS framework |
| **TypeScript** | Type-safe JavaScript development |
| **Vitest** | Unit testing framework |

## Testing

Run unit tests with:

```bash
npm run testUnit
```

Tests are organized in `__tests__` directories within each feature.

## Features In Detail

### Kanban Board

Organize your tasks across multiple columns:
- **To Do**: Tasks you need to complete
- **In Progress**: Tasks currently being worked on
- **Done**: Completed tasks

Drag and drop tasks between columns to update their status. Changes are automatically saved to Firestore.

### Daily Streak

Track your consistency with daily streaks. Completing tasks each day increases your streak counter, helping you maintain momentum and productivity.

### Activity Analytics

View your weekly activity chart to understand your task completion patterns and identify your most productive days.

### Task History

All your completed tasks are saved in your history, providing a record of your accomplishments over time.

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project" and select your repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

### Deploy on Other Platforms

Ensure you set the following environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Troubleshooting

### Firebase Authentication Not Working

- Verify your Firebase credentials in `.env.local`
- Check that Google authentication is enabled in Firebase Console
- Ensure your domain is whitelisted in Firebase Authentication settings

### Firestore Rules Error

- Verify your Firestore security rules are correctly set
- Check that your user ID matches the authenticated user
- Ensure Firestore database is in production mode

### Build Issues

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (18+)

## Documentation

For more detailed information, see:
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**ElGioVR** - [@ElGioVR](https://github.com/ElGioVR)

---

Built with Next.js, React, and Firebase
