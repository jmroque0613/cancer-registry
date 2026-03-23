"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  mrn: string;
  full_name: string;
  date_of_birth: string;
  sex: string;
  contact_number: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/patients/?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      });
  }, [search]);

  return (
    <main style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <Link href="/" style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}>
            ← Home
          </Link>
          <h1 style={{ fontSize: "24px", marginTop: "4px" }}>Patients</h1>
        </div>
        <Link
          href="/patients/new"
          style={{
            padding: "10px 20px",
            background: "#0984e3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          + Add Patient
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name, MRN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          fontSize: "14px",
          marginBottom: "20px",
          outline: "none",
        }}
      />

      {loading ? (
        <p style={{ color: "#636e72" }}>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p style={{ color: "#636e72" }}>No patients found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dfe6e9" }}>
              <th style={th}>MRN</th>
              <th style={th}>Full Name</th>
              <th style={th}>Date of Birth</th>
              <th style={th}>Sex</th>
              <th style={th}>Contact</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                <td style={td}>{p.mrn}</td>
                <td style={td}>{p.full_name}</td>
                <td style={td}>{p.date_of_birth}</td>
                <td style={td}>{p.sex === "M" ? "Male" : p.sex === "F" ? "Female" : "Unknown"}</td>
                <td style={td}>{p.contact_number || "—"}</td>
                <td style={td}>
                  <Link
                    href={`/patients/${p.id}`}
                    style={{ color: "#0984e3", textDecoration: "none", fontSize: "13px" }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const th: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 600,
  color: "#636e72",
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "14px",
};