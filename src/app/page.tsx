"use client";

import { api } from "@/trpc/client";

export default function Home() {
  const {
    data,
    isLoading,
    error,
  } =
  api.gmail.readEmails.useQuery({
    maxResults: 5,
  });

  if (isLoading)
    return <div>Loading...</div>;

  if (error)
    return (
      <div>
        Error: {error.message}
      </div>
    );

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>
        Calendar Events
      </h1>

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