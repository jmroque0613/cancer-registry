"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  sex: string;
  philhealth_id: string;
  contact_number: string;
  address: string;
  city: string;
  province: string;
  is_active: boolean;
  created_at: string;
}

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8002/api/v1/registry/patients/${id}/`).then((r) => r.json()),
      fetch(`http://localhost:8002/api/v1/registry/cases/?patient=${id}`).then((r) => r.json()),
    ]).then(([patientData, casesData]) => {
      setPatient(patientData);
      setCases(Array.isArray(casesData) ? casesData : casesData.results ?? []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main style={{ padding: "40px" }}>Loading...</main>;
  if (!patient) return <main style={{ padding: "40px" }}>Patient not found.</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "700px" }}>
      <Link href="/patients" style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}>
        ← Back to Patients
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 24px" }}>
        <h1 style={{ fontSize: "24px" }}>{patient.full_name}</h1>
        <span style={{
          padding: "4px 12px",
          background: patient.is_active ? "#00b894" : "#b2bec3",
          color: "white",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
        }}>
          {patient.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#636e72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Personal Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="MRN" value={patient.mrn} />
          <Field label="Sex" value={patient.sex === "M" ? "Male" : patient.sex === "F" ? "Female" : "Unknown"} />
          <Field label="First Name" value={patient.first_name} />
          <Field label="Middle Name" value={patient.middle_name || "—"} />
          <Field label="Last Name" value={patient.last_name} />
          <Field label="Date of Birth" value={patient.date_of_birth} />
          <Field label="PhilHealth ID" value={patient.philhealth_id || "—"} />
          <Field label="Contact Number" value={patient.contact_number || "—"} />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#636e72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Address
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="Address" value={patient.address || "—"} />
          <Field label="City" value={patient.city || "—"} />
          <Field label="Province" value={patient.province || "—"} />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#636e72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Cancer Cases
        </h2>
        {cases.length === 0 ? (
          <p style={{ color: "#b2bec3", fontSize: "14px" }}>No cases recorded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f2f6" }}>
                <th style={th}>Primary Site</th>
                <th style={th}>Histology</th>
                <th style={th}>Stage</th>
                <th style={th}>Diagnosis Date</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                  <td style={td}>{c.primary_site}</td>
                  <td style={td}>{c.histology}</td>
                  <td style={td}>{c.stage || "—"}</td>
                  <td style={td}>{c.diagnosis_date}</td>
                  <td style={td}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: c.status === "active" ? "#00b894" : c.status === "remission" ? "#0984e3" : "#b2bec3",
                      color: "white",
                    }}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={td}>
                    <Link
                      href={`/cases/${c.id}`}
                      style={{ color: "#0984e3", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link
          href={`/cases/new?patient=${patient.id}`}
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "9px 18px",
            background: "#0984e3",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          + Add Cancer Case
        </Link>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#b2bec3", marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "14px", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#636e72" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: "13px" };