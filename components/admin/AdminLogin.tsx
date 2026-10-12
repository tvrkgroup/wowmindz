"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = (await response.json()) as { ok: boolean; message?: string };
    setLoading(false);

    if (!result.ok) {
      setMessage(result.message || "Login failed");
      return;
    }

    // The public domain currently embeds this app in a forwarding frame.
    // Sessions must continue in the app's own secure top-level context.
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.location.href;
      return;
    }

    window.location.reload();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card admin-login-card">
          <p className="eyebrow">Secure Access</p>
          <h1>Website Dashboard Login</h1>
          <p>Use your admin credentials to manage website content and settings.</p>
          <form onSubmit={onSubmit} className="admin-login-form">
            <label>
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {message ? <p className="admin-error">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
