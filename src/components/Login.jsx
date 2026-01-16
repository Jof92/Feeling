// src/components/Login.jsx
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      // O App.jsx detectará o login via onAuthStateChanged e redirecionará automaticamente
    } catch (err) {
      console.error("Erro ao fazer login anônimo:", err);
      setError("Ops! Não foi possível conectar. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ Feeling</h1>
        <p style={styles.subtitle}>Compartilhe como você está se sentindo — de forma simples e autêntica.</p>

        {error && <div style={styles.error}>{error}</div>}

        <button
          onClick={handleLogin}
          disabled={loading}
          aria-label={loading ? "Entrando..." : "Entrar anonimamente no Feeling"}
          style={{
            ...styles.button,
            opacity: loading ? 0.8 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Conectando..." : "Começar agora"}
        </button>

        <p style={styles.footer}>
          Nenhum cadastro necessário. Seus dados são salvos apenas enquanto você estiver conectado.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  card: {
    textAlign: "center",
    padding: "36px",
    borderRadius: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    backgroundColor: "#ffffff",
    maxWidth: "420px",
    width: "100%",
    border: "1px solid #eee"
  },
  title: {
    fontSize: "32px",
    margin: "0 0 12px",
    color: "#111",
    fontWeight: "700"
  },
  subtitle: {
    color: "#555",
    marginBottom: "24px",
    fontSize: "16px",
    lineHeight: "1.5"
  },
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
    transition: "background-color 0.2s"
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #fcc"
  },
  footer: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#888",
    lineHeight: "1.5"
  }
};