"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPatientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    is_active: true,
  });

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/patients/${id}/`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          mrn: data.mrn,
          first_name: data.first_name,
          middle_name: data.middle_name || "",
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          sex: data.sex,
          philhealth_id: data.philhealth_id || "",
          contact_number: data.contact_number || "",
          address: data.address || "",
          city: data.city || "",
          province: data.province || "",
          is_active: data.is_active,
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8002/api/v1/registry/patients/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/patients/${id}`);
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
    if (!confirm("Are you sure you want to delete this patient? This cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:8002/api/v1/registry/patients/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/patients");
      }
    } catch {
      setError("Could not delete patient.");
    }
  };

  if (loading) return <main style={{ padding: "40px" }}>Loading...</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <Link href={`/patients/${id}`} style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}>
        ← Back to Patient
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 24px" }}>
        <h1 style={{ fontSize: "24px" }}>Edit Patient</h1>
        <button
          onClick={handleDelete}
          style={{ padding: "8px 16px", background: "#d63031", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}
        >
          Delete Patient
        </button>
      </div>

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

        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} id="is_active" />
          <label htmlFor="is_active" style={{ fontSize: "14px", color: "#2d3436" }}>Active Patient</label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            background: saving ? "#b2bec3" : "#0984e3",
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

const row: React.CSSProperties = { display: "flex", gap: "16px", marginBottom: "16px" };
const col: React.CSSProperties = { flex: 1 };
const label: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#636e72" };
const input: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #dfe6e9", borderRadius: "6px", fontSize: "14px", outline: "none" };