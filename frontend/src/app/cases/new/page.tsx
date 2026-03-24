"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Patient {
  id: string;
  mrn: string;
  full_name: string;
}

export default function NewCasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patient");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({
    patient: patientId ?? "",
    primary_site: "",
    primary_site_code: "",
    histology: "",
    histology_code: "",
    behavior: "3",
    laterality: "0",
    stage: "",
    tnm_t: "",
    tnm_n: "",
    tnm_m: "",
    diagnosis_date: "",
    status: "active",
    remarks: "",
  });

  useEffect(() => {
    if (patientId) {
      fetch(`http://localhost:8002/api/v1/registry/patients/${patientId}/`)
        .then((res) => res.json())
        .then((data) => setPatient(data));
    }
  }, [patientId]);

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
      const res = await fetch("http://localhost:8002/api/v1/registry/cases/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(patientId ? `/patients/${patientId}` : "/cases");
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
        href={patientId ? `/patients/${patientId}` : "/cases"}
        style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}
      >
        ← Back
      </Link>
      <h1 style={{ fontSize: "24px", margin: "8px 0 4px" }}>Add Cancer Case</h1>
      {patient && (
        <p style={{ color: "#636e72", fontSize: "14px", marginBottom: "24px" }}>
          Patient: <strong>{patient.full_name}</strong> — MRN: {patient.mrn}
        </p>
      )}

      {error && (
        <div style={{ background: "#ff7675", color: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "24px", borderRadius: "12px" }}>

        <section style={section}>
          <h2 style={sectionTitle}>Tumor Information</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Primary Site *</label>
              <input style={input} name="primary_site" value={form.primary_site} onChange={handleChange} required placeholder="e.g. Breast" />
            </div>
            <div style={col}>
              <label style={label}>ICD-O Site Code</label>
              <input style={input} name="primary_site_code" value={form.primary_site_code} onChange={handleChange} placeholder="e.g. C50.9" />
            </div>
          </div>
          <div style={row}>
            <div style={col}>
              <label style={label}>Histology *</label>
              <input style={input} name="histology" value={form.histology} onChange={handleChange} required placeholder="e.g. Invasive ductal carcinoma" />
            </div>
            <div style={col}>
              <label style={label}>ICD-O Histology Code</label>
              <input style={input} name="histology_code" value={form.histology_code} onChange={handleChange} placeholder="e.g. 8500/3" />
            </div>
          </div>
          <div style={row}>
            <div style={col}>
              <label style={label}>Behavior</label>
              <select style={input} name="behavior" value={form.behavior} onChange={handleChange}>
                <option value="0">Benign</option>
                <option value="1">Uncertain</option>
                <option value="2">In situ</option>
                <option value="3">Malignant</option>
              </select>
            </div>
            <div style={col}>
              <label style={label}>Laterality</label>
              <select style={input} name="laterality" value={form.laterality} onChange={handleChange}>
                <option value="0">Not applicable</option>
                <option value="1">Right</option>
                <option value="2">Left</option>
                <option value="3">Bilateral</option>
                <option value="9">Unknown</option>
              </select>
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Staging</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Overall Stage</label>
              <select style={input} name="stage" value={form.stage} onChange={handleChange}>
                <option value="">Unknown</option>
                <option value="0">Stage 0</option>
                <option value="I">Stage I</option>
                <option value="II">Stage II</option>
                <option value="III">Stage III</option>
                <option value="IV">Stage IV</option>
              </select>
            </div>
            <div style={col}>
              <label style={label}>Status</label>
              <select style={input} name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="remission">Remission</option>
                <option value="deceased">Deceased</option>
                <option value="lost_to_followup">Lost to Follow-up</option>
              </select>
            </div>
          </div>
          <div style={row}>
            <div style={col}>
              <label style={label}>TNM — T</label>
              <input style={input} name="tnm_t" value={form.tnm_t} onChange={handleChange} placeholder="e.g. T2" />
            </div>
            <div style={col}>
              <label style={label}>TNM — N</label>
              <input style={input} name="tnm_n" value={form.tnm_n} onChange={handleChange} placeholder="e.g. N1" />
            </div>
            <div style={col}>
              <label style={label}>TNM — M</label>
              <input style={input} name="tnm_m" value={form.tnm_m} onChange={handleChange} placeholder="e.g. M0" />
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Diagnosis</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Date of Diagnosis *</label>
              <input style={input} type="date" name="diagnosis_date" value={form.diagnosis_date} onChange={handleChange} required />
            </div>
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
          {loading ? "Saving..." : "Save Cancer Case"}
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
