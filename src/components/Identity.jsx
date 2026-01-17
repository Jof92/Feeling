// src/components/Identity.jsx
import React from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';

const Identity = () => {
  const [user] = useAuthState(auth);
  const [userDoc] = useDocument(user ? doc(db, 'users', user.uid) : null);

  if (!user || !userDoc?.exists()) {
    return null; // ou um fallback de carregamento
  }

  const userData = userDoc.data();
  const displayName = userData.name || user.displayName || 'Usuário';
  const avatar = userData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=5c6bc0&color=fff`;
  const tagline = userData.tagline || 'Compartilhando meus sentimentos...';

  return (
    <div className="identity-card">
      <img src={avatar} alt="Avatar" className="identity-avatar" />
      <div className="identity-info">
        <h3 className="identity-name">{displayName}</h3>
        <p className="identity-tagline">"{tagline}"</p>
      </div>
    </div>
  );
};

export default Identity;