# Firebase setup

1. Create a Firebase project.
2. Enable Authentication with the Google provider.
3. Create a Firestore database.
4. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Use these Firestore rules so each user can only read and write their own tasks
and history:

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

The app signs in with Google, reads the Firebase ID token on the client, and
stores tasks at `users/{uid}/tasks` and audit events at `users/{uid}/history`.
