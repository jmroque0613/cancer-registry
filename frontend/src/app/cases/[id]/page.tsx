"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface CancerCase {
  id: string;
  patient: string;
  patient_name: string;
  patient_mrn: string;
  primary_site: string;
  primary_site_code: string;
  histology: string;
  histology_code: string;
  behavior: string;
  laterality: string;
  stage: string;
  tnm_t: string;
  tnm_n: string;
  tnm_m: string;
  diagnosis_date: string;
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

const behaviorLabel: Record<string, string> = {
  "0": "Benign",
  "1": "Uncertain",
  "2": "In situ",
  "3": "Malignant",
};

const lateralityLabel: Record<string, string> = {
  "0": "Not applicable",
  "1": "Right",
  "2": "Left",
  "3": "Bilateral",
  "9": "Unknown",
};

const statusColor: Record<string, string> = {
  active: "#00b894",
  remission: "#0984e3",
  deceased: "#636e72",
  lost_to_followup: "#b2bec3",
};

export default function CaseDetailPage() {
  const { id } = useParams();
  const [ccase, setCcase] = useState<CancerCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8002/api/v1/registry/cases/${id}/`).then((r) => r.json()),
      fetch(`http://localhost:8002/api/v1/registry/treatments/?case=${id}`).then((r) => r.json()),
      fetch(`http://localhost:8002/api/v1/registry/followups/?case=${id}`).then((r) => r.json()),
    ]).then(([caseData, treatmentData, followupData]) => {
      setCcase(caseData);
      setTreatments(Array.isArray(treatmentData) ? treatmentData : treatmentData.results ?? []);
      setFollowups(Array.isArray(followupData) ? followupData : followupData.results ?? []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main style={{ padding: "40px" }}>Loading...</main>;
  if (!ccase) return <main style={{ padding: "40px" }}>Case not found.</main>;

  return (
    <main style={{ padding: "40px", maxWidth: "700px" }}>
      <Link
        href={`/patients/${ccase.patient}`}
        style={{ color: "#0984e3", textDecoration: "none", fontSize: "14px" }}
      >
        ← Back to Patient
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 24px" }}>
        <div>
          <h1 style={{ fontSize: "24px" }}>{ccase.primary_site}</h1>
          <p style={{ color: "#636e72", fontSize: "14px", marginTop: "4px" }}>
            Patient: <strong>{ccase.patient_name}</strong> — MRN: {ccase.patient_mrn}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            href={`/cases/${id}/edit`}
            style={{ padding: "7px 16px", background: "#f1f2f6", color: "#2d3436", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}
          >
            Edit
          </Link>
          <span style={{
            padding: "4px 14px",
            background: statusColor[ccase.status] ?? "#b2bec3",
            color: "white",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "capitalize",
          }}>
            {ccase.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={sectionTitle}>Tumor Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="Primary Site" value={ccase.primary_site} />
          <Field label="ICD-O Site Code" value={ccase.primary_site_code || "—"} />
          <Field label="Histology" value={ccase.histology} />
          <Field label="ICD-O Histology Code" value={ccase.histology_code || "—"} />
          <Field label="Behavior" value={behaviorLabel[ccase.behavior] ?? ccase.behavior} />
          <Field label="Laterality" value={lateralityLabel[ccase.laterality] ?? ccase.laterality} />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={sectionTitle}>Staging</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="Overall Stage" value={ccase.stage || "—"} />
          <Field label="Date of Diagnosis" value={ccase.diagnosis_date} />
          <Field label="TNM — T" value={ccase.tnm_t || "—"} />
          <Field label="TNM — N" value={ccase.tnm_n || "—"} />
          <Field label="TNM — M" value={ccase.tnm_m || "—"} />
        </div>
      </div>

      {ccase.remarks && (
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={sectionTitle}>Remarks</h2>
          <p style={{ fontSize: "14px", color: "#2d3436", lineHeight: 1.6 }}>{ccase.remarks}</p>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={sectionTitle}>Treatments</h2>
        {treatments.length === 0 ? (
          <p style={{ color: "#b2bec3", fontSize: "14px" }}>No treatments recorded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f2f6" }}>
                <th style={th}>Type</th>
                <th style={th}>Name / Protocol</th>
                <th style={th}>Start Date</th>
                <th style={th}>End Date</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                  <td style={td}>{t.treatment_type_display}</td>
                  <td style={td}>{t.name}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link
          href={`/treatments/new?case=${ccase.id}`}
          style={{
            display: "inline-block",
            marginTop: "4px",
            padding: "9px 18px",
            background: "#0984e3",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          + Add Treatment
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
        <h2 style={sectionTitle}>Follow-ups</h2>
        {followups.length === 0 ? (
          <p style={{ color: "#b2bec3", fontSize: "14px" }}>No follow-ups recorded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f2f6" }}>
                <th style={th}>Date</th>
                <th style={th}>Patient Status</th>
                <th style={th}>Contact Method</th>
                <th style={th}>Next Follow-up</th>
                <th style={th}>Physician</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
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
                  <td style={td}>{f.contact_method_display}</td>
                  <td style={td}>{f.next_followup_date || "—"}</td>
                  <td style={td}>{f.attending_physician || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link
          href={`/followups/new?case=${ccase.id}`}
          style={{
            display: "inline-block",
            marginTop: "4px",
            padding: "9px 18px",
            background: "#00b894",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          + Add Follow-up
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

const sectionTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#636e72",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "16px",
};

const th: React.CSSProperties = { padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#636e72" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: "13px" };