"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#0984e3", "#00b894", "#6c5ce7", "#fdcb6e", "#d63031", "#e17055", "#74b9ff", "#55efc4"];

export default function ReportsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8002/api/v1/registry/cases/")
      .then((r) => r.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <main style={{ padding: "40px" }}>Loading reports...</main>;

  const bySite = Object.entries(
    cases.reduce((acc: any, c) => {
      acc[c.primary_site] = (acc[c.primary_site] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  const byStage = Object.entries(
    cases.reduce((acc: any, c) => {
      const stage = c.stage || "Unknown";
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const byStatus = Object.entries(
    cases.reduce((acc: any, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  const bySex = Object.entries(
    cases.reduce((acc: any, c) => {
      const sex = c.sex === "M" ? "Male" : c.sex === "F" ? "Female" : c.sex === "U" ? "Unknown" : "Not specified";
      acc[sex] = (acc[sex] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Reports</h1>
      <p style={{ color: "#636e72", fontSize: "14px", marginBottom: "32px" }}>
        Based on {cases.length} registered cancer case{cases.length !== 1 ? "s" : ""}
      </p>

      {cases.length === 0 ? (
        <div style={{ background: "white", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#b2bec3", fontSize: "16px" }}>No cases registered yet.</p>
          <p style={{ color: "#b2bec3", fontSize: "14px", marginTop: "8px" }}>Add cancer cases to generate reports.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

            <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
              <h2 style={chartTitle}>Cases by Status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
              <h2 style={chartTitle}>Cases by Stage</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f2f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
            <h2 style={chartTitle}>Top 10 Primary Sites</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bySite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f2f6" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={160} />
                <Tooltip />
                <Bar dataKey="count" fill="#0984e3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
            <h2 style={chartTitle}>Cases by Sex</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bySex} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {bySex.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </main>
  );
}

const chartTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#2d3436",
  marginBottom: "16px",
};