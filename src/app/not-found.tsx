import Link from "next/link";
import React from "react";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa"
        }}>
           
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#343a40" }}>404</h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", color: "#495057" }}>
                Página não encontrada.
            </p>
                 <Link href="/"  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#0070f3",
                    color: "#fff",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    Voltar para a página inicial
                </Link>
        
        </div>
    );
}