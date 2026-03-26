"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/patients", label: "Patients", icon: "♟" },
  { href: "/cases", label: "Cancer Cases", icon: "⊕" },
  { href: "/treatments", label: "Treatments", icon: "✚" },
  { href: "/followups", label: "Follow-ups", icon: "↻" },
  { href: "/reports", label: "Reports", icon: "▤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "#1a1f2e",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>
          Hospital System
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "white" }}>
          Cancer Registry
        </div>
      </div>

      <nav style={{ padding: "12px 0", flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              fontSize: "14px",
              textDecoration: "none",
              color: isActive(item.href) ? "white" : "rgba(255,255,255,0.5)",
              background: isActive(item.href) ? "rgba(255,255,255,0.1)" : "transparent",
              borderLeft: isActive(item.href) ? "3px solid #0984e3" : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
      }}>
        v1.0.0 — Development
      </div>
    </aside>
  );
}