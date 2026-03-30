import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RootNotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "1rem",
      textAlign: "center",
      padding: "0 1rem",
      fontFamily: "sans-serif",
      background: "#fff",
      color: "#111",
    }} dir="rtl">
      <p style={{ fontSize: "6rem", fontWeight: 700, lineHeight: 1, color: "rgba(0,0,0,0.1)", margin: 0 }}>
        404
      </p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
        الصفحة غير موجودة
      </h1>
      <p style={{ color: "#888", maxWidth: "24rem", fontSize: "0.875rem", margin: 0 }}>
        عذراً، الصفحة اللي بتدوري عليها مش موجودة.
      </p>
      <Link href="/ar/home" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1.25rem",
        borderRadius: "0.5rem",
        background: "#9b1c2e",
        color: "#fff",
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}>
        <ArrowLeft size={16} />
        الرجوع للرئيسية
      </Link>
    </div>
  );
}
