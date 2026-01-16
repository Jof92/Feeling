// src/components/PostBox.jsx
import { useState } from "react";
import { db, auth } from "../firebase"; // ← importe seu firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // ← se você usar Firebase Storage

export default function PostBox({ currentFeeling, onPostPublished }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handlePublish() {
    if (!currentFeeling || (!text.trim() && !image)) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado para postar.");
      return;
    }

    setUploading(true);

    let imageUrl = null;
    if (image) {
      try {
        // Gera um nome único para a imagem
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
        alert("Falha ao enviar imagem.");
        setUploading(false);
        return;
      }
    }

    try {
      const postData = {
        text: text.trim(),
        feeling: currentFeeling,
        userId: user.uid,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(), // ← horário do servidor (mais confiável)
        likes: [],
        comments: []
      };

      const docRef = await addDoc(collection(db, "posts"), postData);
      console.log("Post salvo com ID:", docRef.id);

      // Notifica o componente pai (ex: App) que um post foi criado
      if (onPostPublished) onPostPublished();

      // Limpa os campos
      setText("");
      setImage(null);
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      alert("Não foi possível publicar. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={styles.box}>
      <textarea
        placeholder="Compartilhe algo..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
        disabled={uploading}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        disabled={uploading}
      />
      <button
        onClick={handlePublish}
        style={styles.button}
        disabled={uploading || (!text.trim() && !image)}
      >
        {uploading ? "Publicando..." : "Compartilhar"}
      </button>
    </div>
  );
}

const styles = {
  box: {
    background: "#fff",
    padding: "15px",
    borderRadius: "14px",
    marginBottom: "25px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)"
  },
  textarea: {
    width: "100%",
    border: "none",
    resize: "none",
    minHeight: "70px",
    fontSize: "16px",
    outline: "none"
  },
  button: {
    marginTop: "12px",
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "20px",
    cursor: "pointer"
  }
};