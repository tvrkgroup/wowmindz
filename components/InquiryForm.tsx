"use client";

import { useState } from "react";
import CustomSelect from "@/components/CustomSelect";

export default function InquiryForm() {
  const [type, setType] = useState<"feedback" | "inquiry">("inquiry");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Submitting...");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, phone, email, message }),
      });

      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!result.ok) {
        setStatus(result.message || "Submission failed");
        return;
      }

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setStatus("Inquiry submitted successfully. You can view it in Admin Dashboard -> Inquiries.");
    } catch {
      setStatus("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      <label>
        Type
        <CustomSelect
          value={type}
          onChange={(next) => setType(next as "feedback" | "inquiry")}
          ariaLabel="Select inquiry type"
          options={[
            { value: "inquiry", label: "Inquiry" },
            { value: "feedback", label: "Feedback" },
          ]}
        />
      </label>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Phone
        <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
      </label>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Message
        <textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} required />
      </label>
      <button type="submit" className="button" disabled={loading}>
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
      <p className="admin-help">{status}</p>
    </form>
  );
}
