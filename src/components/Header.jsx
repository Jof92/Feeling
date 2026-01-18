// src/components/Header.jsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header id="header" style={styles.header}>
      <span style={styles.title}>Feeling</span>
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
        aria-label="Sair da conta"
      >
        Sair
      </button>
    </header>
  );
}

const styles = {
  header: {
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#5c6bc0", // cor padrão ou use uma variável se quiser manter dinâmico
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  logoutButton: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.7)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};