"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface CancerCase {
  id: string;
  primary_site: string;
  patient_name: string;
  patient_mrn: string;
}

export default function NewTreatmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ccase, setCcase] = useState<CancerCase | null>(null);
  const [form, setForm] = useState({
    case: caseId ?? "",
    treatment_type: "surgery",
    name: "",
    institution: "",
    physician: "",
    start_date: "",
    end_date: "",
    status: "planned",
    dose: "",
    response: "",
    remarks: "",
  });

  useEffect(() => {
    if (caseId) {
      fetch(`http://localhost:8002/api/v1/registry/cases/${caseId}/`)
        .then((r) => r.json())
        .then((data) => setCcase(data));
    }
  }, [caseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8002/api/v1/registry/treatments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(caseId ? `/cases/${caseId}` : "/");
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
    <main style={{ padding: "40px", maxWidth: "680px" }}>
      <Link
        href={caseId ? `/cases/${caseId}` : "/"}
        style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}
      >
        ← Back
      </Link>
      <h1 style={{ fontSize: "24px", margin: "8px 0 4px" }}>Add Treatment</h1>
      {ccase && (
        <p style={{ color: "#636e72", fontSize: "14px", marginBottom: "24px" }}>
          Case: <strong>{ccase.primary_site}</strong> — Patient: {ccase.patient_name} ({ccase.patient_mrn})
        </p>
      )}

      {error && (
        <div style={{ background: "#ff7675", color: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "24px", borderRadius: "12px" }}>

        <section style={section}>
          <h2 style={sectionTitle}>Treatment Details</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Treatment Type *</label>
              <select style={input} name="treatment_type" value={form.treatment_type} onChange={handleChange}>
                <option value="surgery">Surgery</option>
                <option value="chemotherapy">Chemotherapy</option>
                <option value="radiation">Radiation Therapy</option>
                <option value="immunotherapy">Immunotherapy</option>
                <option value="hormone">Hormone Therapy</option>
                <option value="targeted">Targeted Therapy</option>
                <option value="palliative">Palliative Care</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={col}>
              <label style={label}>Status *</label>
              <select style={input} name="status" value={form.status} onChange={handleChange}>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Treatment Name / Protocol *</label>
            <input
              style={{ ...input, width: "100%" }}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Modified Radical Mastectomy, AC-T Protocol"
            />
          </div>

          <div style={row}>
            <div style={col}>
              <label style={label}>Institution</label>
              <input style={input} name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. PGH" />
            </div>
            <div style={col}>
              <label style={label}>Attending Physician</label>
              <input style={input} name="physician" value={form.physician} onChange={handleChange} placeholder="e.g. Dr. Santos" />
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Schedule</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Start Date *</label>
              <input style={input} type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
            </div>
            <div style={col}>
              <label style={label}>End Date</label>
              <input style={input} type="date" name="end_date" value={form.end_date} onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Dose / Cycles</label>
            <input
              style={{ ...input, width: "100%" }}
              name="dose"
              value={form.dose}
              onChange={handleChange}
              placeholder="e.g. 6 cycles, 60 Gy in 30 fractions"
            />
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Outcome</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Treatment Response</label>
            <input
              style={{ ...input, width: "100%" }}
              name="response"
              value={form.response}
              onChange={handleChange}
              placeholder="e.g. Complete response, Partial response"
            />
          </div>
          <div>
            <label style={label}>Remarks</label>
            <textarea
              style={{ ...input, width: "100%", height: "80px", resize: "vertical" }}
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
            />
          </div>
        </section>

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
          {loading ? "Saving..." : "Save Treatment"}
        </button>
      </form>
    </main>
  );
}

const section: React.CSSProperties = { marginBottom: "24px" };
const sectionTitle: React.CSSProperties = { fontSize: "13px", fontWeight: 600, color: "#636e72", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" };
const row: React.CSSProperties = { display: "flex", gap: "16px", marginBottom: "16px" };
const col: React.CSSProperties = { flex: 1 };
const label: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#636e72" };
const input: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #dfe6e9", borderRadius: "6px", fontSize: "14px", outline: "none" };