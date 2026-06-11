"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await res.json();

    setResponse(data.response);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Coxswain AI</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about your calendar..."
        style={{
          width: "400px",
          padding: "10px",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px",
        }}
      >
        Send
      </button>

      <pre
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </pre>
    </div>
  );
}