"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditFollowUpPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [caseId, setCaseId] = useState("");
  const [form, setForm] = useState({
    followup_date: "",
    next_followup_date: "",
    patient_status: "alive_no_evidence",
    contact_method: "clinic_visit",
    weight_kg: "",
    performance_status: "",
    disease_status: "",
    complications: "",
    remarks: "",
    attending_physician: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/followups/${id}/`)
      .then((r) => r.json())
      .then((data) => {
        setCaseId(data.case);
        setForm({
          followup_date: data.followup_date,
          next_followup_date: data.next_followup_date || "",
          patient_status: data.patient_status,
          contact_method: data.contact_method,
          weight_kg: data.weight_kg || "",
          performance_status: data.performance_status || "",
          disease_status: data.disease_status || "",
          complications: data.complications || "",
          remarks: data.remarks || "",
          attending_physician: data.attending_physician || "",
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: any = { ...form };
    if (!payload.next_followup_date) delete payload.next_followup_date;
    if (!payload.weight_kg) delete payload.weight_kg;

    try {
      const res = await fetch(`http://localhost:8002/api/v1/registry/followups/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/cases/${caseId}`);
      } else {
        const data = await res.json();
        setError(JSON.stringify(data));
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this follow-up? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:8002/api/v1/registry/followups/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) router.push(`/cases/${caseId}`);
    } catch {
      setError("Could not delete follow-up.");
    }
  };

  if (loading) return <main style={{ padding: "40px" }}>Loading...</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "680px" }}>
      <Link href={`/cases/${caseId}`} style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}>
        ← Back to Case
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 24px" }}>
        <h1 style={{ fontSize: "24px" }}>Edit Follow-up</h1>
        <button
          onClick={handleDelete}
          style={{ padding: "8px 16px", background: "#d63031", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}
        >
          Delete Follow-up
        </button>
      </div>

      {error && (
        <div style={{ background: "#ff7675", color: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
        <section style={section}>
          <h2 style={sectionTitle}>Visit Information</h2>
          <div style={row}>
            <div style={col}>
              <label style={label}>Follow-up Date *</label>
              <input style={input} type="date" name="followup_date" value={form.followup_date} onChange={handleChange} required />
            </div>
            <div style={col}>
              <label style={label}>Next Follow-up Date</label>
              <input style={input} type="date" name="next_followup_date" value={form.next_followup_date} onChange={handleChange} />
            </div>
          </div>
          <div style={row}>
            <div style={col}>
              <label style={label}>Contact Method *</label>
              <select style={input} name="contact_method" value={form.contact_method} onChange={handleChange}>
                <option value="clinic_visit">Clinic Visit</option>
                <option value="phone_call">Phone Call</option>
                <option value="letter">Letter</option>
                <option value="home_visit">Home Visit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={col}>
              <label style={label}>Attending Physician</label>
              <input style={input} name="attending_physician" value={form.attending_physician} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Patient Status</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Patient Status *</label>
            <select style={{ ...input, width: "100%" }} name="patient_status" value={form.patient_status} onChange={handleChange}>
              <option value="alive_no_evidence">Alive — No Evidence of Disease</option>
              <option value="alive_with_disease">Alive — With Disease</option>
              <option value="alive_unknown">Alive — Unknown Status</option>
              <option value="deceased_disease">Deceased — Due to Disease</option>
              <option value="deceased_other">Deceased — Other Causes</option>
              <option value="lost_to_followup">Lost to Follow-up</option>
            </select>
          </div>
          <div style={row}>
            <div style={col}>
              <label style={label}>Weight (kg)</label>
              <input style={input} type="number" step="0.01" name="weight_kg" value={form.weight_kg} onChange={handleChange} />
            </div>
            <div style={col}>
              <label style={label}>ECOG Performance Status</label>
              <select style={input} name="performance_status" value={form.performance_status} onChange={handleChange}>
                <option value="">Unknown</option>
                <option value="0">0 — Fully active</option>
                <option value="1">1 — Restricted but ambulatory</option>
                <option value="2">2 — Ambulatory, self-care only</option>
                <option value="3">3 — Limited self-care</option>
                <option value="4">4 — Completely disabled</option>
              </select>
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Clinical Notes</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Disease Status Notes</label>
            <input style={{ ...input, width: "100%" }} name="disease_status" value={form.disease_status} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Complications / Side Effects</label>
            <textarea style={{ ...input, width: "100%", height: "80px", resize: "vertical" }} name="complications" value={form.complications} onChange={handleChange} />
          </div>
          <div>
            <label style={label}>Remarks</label>
            <textarea style={{ ...input, width: "100%", height: "80px", resize: "vertical" }} name="remarks" value={form.remarks} onChange={handleChange} />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            background: saving ? "#b2bec3" : "#00b894",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
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