// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./components/Header";
import PostBox from "./components/PostBox";
import Feed from "./components/Feed";
import Login from "./components/Login"; // ← novo

const feelingTheme = {
  happy: { body: "#FFF9DB", dark: "#F1C40F" },
  sad: { body: "#E7F5FF", dark: "#1C7ED6" },
  love: { body: "#FFF0F3", dark: "#E03131" },
  angry: { body: "#FFF4E6", dark: "#E8590C" },
  peace: { body: "#EBFBEE", dark: "#2F9E44" }
};

function App() {
  const [user, setUser] = useState(null); // ← controle de login
  const [currentFeeling, setCurrentFeeling] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se há usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Aplica tema
  useEffect(() => {
    if (!currentFeeling) {
      document.body.style.background = user ? "#ffffff" : "#f8f9fa";
      return;
    }
    document.body.style.background = feelingTheme[currentFeeling].body;

    const header = document.getElementById("header");
    if (header) {
      header.style.background = feelingTheme[currentFeeling].dark;
    }
  }, [currentFeeling, user]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header onSetFeeling={setCurrentFeeling} />
      <div style={styles.container}>
        <PostBox currentFeeling={currentFeeling} />
        <Feed />
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "650px",
    margin: "20px auto",
    padding: "0 15px"
  }
};

export default App;