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

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/patients/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
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
        <p style={{ color: "#b2bec3", fontSize: "14px" }}>No cases recorded yet.</p>
        <button style={{
          marginTop: "12px",
          padding: "9px 18px",
          background: "#0984e3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          cursor: "pointer",
          fontWeight: 500,
        }}>
          + Add Cancer Case
        </button>
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