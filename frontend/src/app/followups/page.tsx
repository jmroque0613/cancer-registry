"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FollowUp {
  id: string;
  case: string;
  patient_name: string;
  patient_mrn: string;
  primary_site: string;
  followup_date: string;
  next_followup_date: string;
  patient_status: string;
  patient_status_display: string;
  contact_method_display: string;
  attending_physician: string;
}

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8002/api/v1/registry/followups/?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setFollowups(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      });
  }, [search]);

  return (
    <main style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px" }}>Follow-ups</h1>
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
        <p style={{ color: "#636e72" }}>Loading follow-ups...</p>
      ) : followups.length === 0 ? (
        <p style={{ color: "#636e72" }}>No follow-ups found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dfe6e9" }}>
              <th style={th}>Patient</th>
              <th style={th}>MRN</th>
              <th style={th}>Primary Site</th>
              <th style={th}>Follow-up Date</th>
              <th style={th}>Patient Status</th>
              <th style={th}>Next Follow-up</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {followups.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                <td style={td}>{f.patient_name}</td>
                <td style={td}>{f.patient_mrn}</td>
                <td style={td}>{f.primary_site}</td>
                <td style={td}>{f.followup_date}</td>
                <td style={td}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: f.patient_status.startsWith("alive_no") ? "#00b894" : f.patient_status.startsWith("alive_with") ? "#fdcb6e" : f.patient_status.startsWith("deceased") ? "#636e72" : "#b2bec3",
                    color: "white",
                  }}>
                    {f.patient_status_display}
                  </span>
                </td>
                <td style={td}>{f.next_followup_date || "—"}</td>
                <td style={td}>
                  <Link
                    href={`/cases/${f.case}`}
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