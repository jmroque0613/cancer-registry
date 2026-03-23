import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        Cancer Registry System
      </h1>
      <p style={{ color: "#636e72", marginBottom: "32px" }}>
        Hospital Cancer Registry Information System
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <Link
          href="/patients"
          style={{
            padding: "12px 24px",
            background: "#0984e3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          View Patients
        </Link>
      </div>
    </main>
  );
}