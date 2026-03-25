"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CancerCase {
  id: string;
  patient_name: string;
  patient_mrn: string;
  primary_site: string;
  histology: string;
  stage: string;
  diagnosis_date: string;
  status: string;
}

const statusColor: Record<string, string> = {
  active: "#00b894",
  remission: "#0984e3",
  deceased: "#636e72",
  lost_to_followup: "#b2bec3",
};

export default function CasesPage() {
  const [cases, setCases] = useState<CancerCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/cases/?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      });
  }, [search]);

  return (
    <main style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px" }}>Cancer Cases</h1>
      </div>

      <input
        type="text"
        placeholder="Search by patient name, MRN, or primary site..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setLoading(true); }}
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
        <p style={{ color: "#636e72" }}>Loading cases...</p>
      ) : cases.length === 0 ? (
        <p style={{ color: "#636e72" }}>No cases found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dfe6e9" }}>
              <th style={th}>Patient</th>
              <th style={th}>MRN</th>
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
                <td style={td}>{c.patient_name}</td>
                <td style={td}>{c.patient_mrn}</td>
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
                    background: statusColor[c.status] ?? "#b2bec3",
                    color: "white",
                  }}>
                    {c.status.replace("_", " ")}
                  </span>
                </td>
                <td style={td}>
                  <Link
                    href={`/cases/${c.id}`}
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

const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#636e72" };
const td: React.CSSProperties = { padding: "12px 16px", fontSize: "14px" };