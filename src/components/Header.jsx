// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { db, auth } from "../firebase"; // 👈 agora importa auth também
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const feelingColors = {
  happy: "#FFD700",
  sad: "#5DADE2",
  love: "#EC7063",
  angry: "#E74C3C",
  peace: "#58D68D",
};

const feelingEmojis = {
  happy: "😀",
  sad: "😢",
  love: "❤️",
  angry: "😡",
  peace: "😌",
};

export default function Header({ onSetFeeling }) {
  const [selectedFeeling, setSelectedFeeling] = useState("happy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Função para salvar no Firestore — agora com autenticação
  const saveFeelingToFirestore = async (feeling) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("Usuário não está logado. Sentimento não será salvo.");
      return;
    }

    try {
      await addDoc(collection(db, "feelings"), {
        feeling,
        userId: user.uid, // 👈 identifica o usuário
        timestamp: serverTimestamp(),
      });
      console.log("Sentimento salvo no Firebase:", feeling);
    } catch (error) {
      console.error("Erro ao salvar sentimento no Firebase:", error);
    }
  };

  const handleSelectFeeling = (feeling) => {
    setSelectedFeeling(feeling);
    onSetFeeling(feeling);
    saveFeelingToFirestore(feeling);
    setIsDropdownOpen(false);
  };

  const currentEmoji = feelingEmojis[selectedFeeling];
  const currentColor = feelingColors[selectedFeeling];

  return (
    <header
      id="header"
      style={{
        ...styles.header,
        backgroundColor: currentColor,
        transition: "background-color 0.4s ease",
      }}
    >
      <div style={styles.titleContainer}>
        <span style={styles.title}>Feeling</span>
        <span
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={styles.selectedEmoji}
          role="button"
          tabIndex={0}
        >
          {currentEmoji}
        </span>
      </div>

      {/* Dropdown de emoções */}
      {isDropdownOpen && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {Object.entries(feelingEmojis).map(([key, emoji]) => (
            <span
              key={key}
              onClick={() => handleSelectFeeling(key)}
              style={styles.dropdownItem}
              title={key}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
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
    position: "relative",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  selectedEmoji: {
    fontSize: "24px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    padding: "8px",
    display: "flex",
    gap: "12px",
    zIndex: 1000,
  },
  dropdownItem: {
    fontSize: "20px",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  },
};