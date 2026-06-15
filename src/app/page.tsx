"use client";

import {
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

import { api } from "@/trpc/client";

export default function Home() {
  const {
    data,
    isLoading,
    error,
  } = api.gmail.readEmails.useQuery({
    maxResults: 5,
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Coxswain AI</h1>

      <div style={{ marginBottom: 20 }}>
        <SignInButton />
      </div>

      <div style={{ marginBottom: 20 }}>
        <UserButton />
      </div>

      {isLoading && <div>Loading...</div>}

      {error && (
        <div>
          Error: {error.message}
        </div>
      )}

      <pre>
        {JSON.stringify(
          data,
          null,
          2
        )}
      </pre>
    </div>
  );
}