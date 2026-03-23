"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    mrn: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    sex: "M",
    philhealth_id: "",
    contact_number: "",
    address: "",
    city: "",
    province: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8002/api/v1/registry/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/patients");
      } else {
        const data = await res.json();
        setError(JSON.stringify(data));
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <Link href="/patients" style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}>
        ← Back to Patients
      </Link>
      <h1 style={{ fontSize: "24px", margin: "8px 0 24px" }}>Add New Patient</h1>

      {error && (
        <div style={{ background: "#ff7675", color: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
        <div style={row}>
          <div style={col}>
            <label style={label}>MRN *</label>
            <input style={input} name="mrn" value={form.mrn} onChange={handleChange} required />
          </div>
          <div style={col}>
            <label style={label}>Sex *</label>
            <select style={input} name="sex" value={form.sex} onChange={handleChange}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="U">Unknown</option>
            </select>
          </div>
        </div>

        <div style={row}>
          <div style={col}>
            <label style={label}>First Name *</label>
            <input style={input} name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>
          <div style={col}>
            <label style={label}>Middle Name</label>
            <input style={input} name="middle_name" value={form.middle_name} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={label}>Last Name *</label>
          <input style={{ ...input, width: "100%" }} name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>

        <div style={row}>
          <div style={col}>
            <label style={label}>Date of Birth *</label>
            <input style={input} type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required />
          </div>
          <div style={col}>
            <label style={label}>PhilHealth ID</label>
            <input style={input} name="philhealth_id" value={form.philhealth_id} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={label}>Contact Number</label>
          <input style={{ ...input, width: "100%" }} name="contact_number" value={form.contact_number} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={label}>Address</label>
          <textarea style={{ ...input, width: "100%", height: "80px", resize: "vertical" }} name="address" value={form.address} onChange={handleChange} />
        </div>

        <div style={row}>
          <div style={col}>
            <label style={label}>City</label>
            <input style={input} name="city" value={form.city} onChange={handleChange} />
          </div>
          <div style={col}>
            <label style={label}>Province</label>
            <input style={input} name="province" value={form.province} onChange={handleChange} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#b2bec3" : "#0984e3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "8px",
          }}
        >
          {loading ? "Saving..." : "Save Patient"}
        </button>
      </form>
    </main>
  );
}

const row: React.CSSProperties = { display: "flex", gap: "16px", marginBottom: "16px" };
const col: React.CSSProperties = { flex: 1 };
const label: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#636e72" };
const input: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #dfe6e9", borderRadius: "6px", fontSize: "14px", outline: "none" };
