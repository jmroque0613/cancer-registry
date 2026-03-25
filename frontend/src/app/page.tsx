"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    cases: 0,
    treatments: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8002/api/v1/registry/patients/").then((r) => r.json()),
      fetch("http://localhost:8002/api/v1/registry/cases/").then((r) => r.json()),
      fetch("http://localhost:8002/api/v1/registry/treatments/").then((r) => r.json()),
    ]).then(([patients, cases, treatments]) => {
      setStats({
        patients: Array.isArray(patients) ? patients.length : patients.count ?? 0,
        cases: Array.isArray(cases) ? cases.length : cases.count ?? 0,
        treatments: Array.isArray(treatments) ? treatments.length : treatments.count ?? 0,
      });
    });
  }, []);

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#636e72", marginBottom: "32px", fontSize: "14px" }}>
        Welcome to the Cancer Registry Information System
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
        <StatCard label="Total Patients" value={stats.patients} color="#0984e3" href="/patients" />
        <StatCard label="Cancer Cases" value={stats.cases} color="#6c5ce7" href="/cases" />
        <StatCard label="Treatments" value={stats.treatments} color="#00b894" href="/treatments" />
      </div>

      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Quick Actions</h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <QuickLink href="/patients/new" label="+ Register Patient" />
        <QuickLink href="/cases/new" label="+ Add Cancer Case" />
        <QuickLink href="/treatments/new" label="+ Add Treatment" />
      </div>
    </main>
  );
}

function StatCard({ label, value, color, href }: { label: string; value: number; color: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        borderTop: `4px solid ${color}`,
        cursor: "pointer",
      }}>
        <div style={{ fontSize: "36px", fontWeight: 700, color, marginBottom: "8px" }}>{value}</div>
        <div style={{ fontSize: "14px", color: "#636e72" }}>{label}</div>
      </div>
    </Link>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "10px 20px",
        background: "white",
        border: "1px solid #dfe6e9",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "14px",
        color: "#2d3436",
        fontWeight: 500,
      }}
    >
      {label}
    </Link>
  );
}