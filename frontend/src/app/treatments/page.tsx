"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Treatment {
  id: string;
  case: string;
  treatment_type_display: string;
  name: string;
  physician: string;
  start_date: string;
  end_date: string;
  status: string;
  status_display: string;
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/treatments/?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setTreatments(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      });
  }, [search]);

  return (
    <main style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px" }}>Treatments</h1>
      </div>

      <input
        type="text"
        placeholder="Search by patient name, MRN, or treatment name..."
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
        <p style={{ color: "#636e72" }}>Loading treatments...</p>
      ) : treatments.length === 0 ? (
        <p style={{ color: "#636e72" }}>No treatments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dfe6e9" }}>
              <th style={th}>Type</th>
              <th style={th}>Name / Protocol</th>
              <th style={th}>Physician</th>
              <th style={th}>Start Date</th>
              <th style={th}>End Date</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                <td style={td}>{t.treatment_type_display}</td>
                <td style={td}>{t.name}</td>
                <td style={td}>{t.physician || "—"}</td>
                <td style={td}>{t.start_date}</td>
                <td style={td}>{t.end_date || "—"}</td>
                <td style={td}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: t.status === "completed" ? "#00b894" : t.status === "ongoing" ? "#0984e3" : t.status === "discontinued" ? "#d63031" : "#fdcb6e",
                    color: "white",
                  }}>
                    {t.status_display}
                  </span>
                </td>
                <td style={td}>
                  <Link
                    href={`/cases/${t.case}`}
                    style={{ color: "#0984e3", textDecoration: "none", fontSize: "13px" }}
                  >
                    View Case
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