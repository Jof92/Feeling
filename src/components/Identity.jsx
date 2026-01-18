// src/components/Identity.jsx
import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import './Identity.css';

const feelingEmojis = {
  happy: "😀",
  sad: "😢",
  love: "❤️",
  angry: "😡",
  peace: "😌",
};

const Identity = ({ currentFeeling, onSetFeeling }) => {
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(db, 'users', user.uid) : null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [editableTagline, setEditableTagline] = useState('');

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const photoMenuRef = useRef(null);
  const taglineRef = useRef(null);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) {
        setShowPhotoMenu(false);
      }
      if (isEditingTagline && taglineRef.current && !taglineRef.current.contains(e.target)) {
        saveTagline();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingTagline]);

  // Inicializar tagline editável
  useEffect(() => {
    if (userDoc?.exists()) {
      const data = userDoc.data();
      const tagline = data.tagline || 'Compartilhando meus sentimentos...';
      setEditableTagline(tagline);
    }
  }, [userDoc]);

  // Salvar sentimento
  const saveFeelingToFirestore = async (feeling) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "feelings"), {
        feeling,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao salvar sentimento:", error);
    }
  };

  const handleSelectFeeling = (feeling) => {
    onSetFeeling(feeling);
    saveFeelingToFirestore(feeling);
    setIsDropdownOpen(false);
  };

  // Upload de nova foto via Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    setLoadingUpload(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'feeling_upload');
      formData.append('folder', 'avatars');

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      // ✅ Corrigido: removido o espaço na URL
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        await updateDoc(doc(db, 'users', user.uid), { avatar: data.secure_url });
        alert('Foto atualizada com sucesso!');
      } else {
        throw new Error(data.error?.message || 'Erro no upload');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao enviar foto. Tente novamente.');
    } finally {
      setLoadingUpload(false);
      setShowPhotoMenu(false);
    }
  };

  // Editar tagline
  const startEditing = () => {
    if (!user) return;
    setIsEditingTagline(true);
  };

  const handleTaglineChange = (e) => {
    setEditableTagline(e.target.value);
  };

  const handleTaglineKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTagline();
    }
  };

  const saveTagline = async () => {
    if (!user || !isEditingTagline) return;
    const trimmed = editableTagline.trim() || 'Compartilhando meus sentimentos...';
    try {
      await updateDoc(doc(db, 'users', user.uid), { tagline: trimmed });
      setEditableTagline(trimmed);
    } catch (err) {
      console.error('Erro ao salvar tagline:', err);
      alert('Erro ao salvar a frase.');
    } finally {
      setIsEditingTagline(false);
    }
  };

  if (!user || !userDoc?.exists()) {
    return null;
  }

  const userData = userDoc.data();
  const displayName = userData.name || user.displayName || 'Usuário';
  const avatar = userData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=5c6bc0&color=fff`;
  const currentEmoji = feelingEmojis[currentFeeling] || feelingEmojis.happy;

  return (
    <div className="identity-card">
      {/* Foto com clique */}
      <div
        className="identity-avatar-wrapper"
        onClick={() => setShowPhotoMenu(!showPhotoMenu)}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        <img src={avatar} alt="Avatar" className="identity-avatar" />
        {showPhotoMenu && (
          <div className="photo-menu" ref={photoMenuRef}>
            <button
              type="button"
              className="photo-menu-btn view-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(true);
                setShowPhotoMenu(false);
              }}
            >
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              Ver imagem
            </button>
            <button 
              type="button" 
              className="photo-menu-btn change-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }} 
              disabled={loadingUpload}
            >
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              {loadingUpload ? 'Enviando...' : 'Trocar foto'}
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <div className="identity-info">
        {/* Nome com fonte moderna */}
        <h3 className="identity-name">{displayName}</h3>
        
        {/* Tagline editável com clique duplo */}
        <div
          ref={taglineRef}
          className={`identity-tagline ${isEditingTagline ? 'editing' : ''}`}
          onDoubleClick={startEditing}
          title="Clique duas vezes para editar"
        >
          {isEditingTagline ? (
            <input
              type="text"
              value={editableTagline}
              onChange={handleTaglineChange}
              onKeyDown={handleTaglineKeyDown}
              onBlur={saveTagline}
              autoFocus
              className="tagline-input"
            />
          ) : (
            `"${editableTagline}"`
          )}
        </div>
      </div>

      {/* Seletor de emoção */}
      <div className="feeling-selector" ref={dropdownRef}>
        <span
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="current-feeling-emoji"
          role="button"
          aria-label="Selecione seu sentimento"
        >
          {currentEmoji}
        </span>

        {isDropdownOpen && (
          <div className="feeling-dropdown">
            {Object.entries(feelingEmojis).map(([key, emoji]) => (
              <span
                key={key}
                onClick={() => handleSelectFeeling(key)}
                className="feeling-option"
                title={key}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modal de imagem ampliada */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-button"
              onClick={() => setShowImageModal(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <img src={avatar} alt="Foto ampliada" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Identity;