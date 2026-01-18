// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import feelingImage from '../assets/feeling3.png';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './Home.css';

const emojis = ['🙂', '😢', '😊', '😴', '😠', '😍'];

const Home = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % emojis.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email,
          name,
          nickname,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5c6bc0&color=fff`,
          createdAt: new Date(),
        });

        await sendEmailVerification(user);
        alert('Conta criada! Verifique seu e-mail.');
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="home-container">
      {/* Imagem à esquerda */}
      <div className="left-section">
        <div className="logo-container">
          <img src={feelingImage} alt="Feeling" className="feeling-logo" />
        </div>
      </div>

      {/* Seção direita */}
      <div className="right-section">
        <div className="border-line"></div>

        {/* Carta flip container */}
        <div className={`flip-card ${showAuth ? 'flipped' : ''}`}>
          {/* Frente da carta: emoção + botões */}
          <div className="flip-card-front">
            <h1 className="feeling-question">Como você está se sentindo agora?</h1>
            <div className="emoji-display">
              <span className="emoji">{emojis[currentEmojiIndex]}</span>
            </div>
            <div className="auth-buttons-initial">
              <button
                className="btn-register"
                onClick={() => {
                  setAuthMode('register');
                  setShowAuth(true);
                }}
              >
                Cadastre-se
              </button>
              <button
                className="btn-login"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuth(true);
                }}
              >
                Entre aqui
              </button>
            </div>
          </div>

          {/* Verso da carta: formulário */}
          <div className="flip-card-back">
            <button
              className="back-button"
              onClick={() => setShowAuth(false)}
              aria-label="Voltar"
            >
              ←
            </button>

            <form onSubmit={handleEmailAuth} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              {authMode === 'register' && (
                <>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {authMode === 'register' && (
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <button type="submit" disabled={loading}>
                {loading ? 'Carregando...' : authMode === 'register' ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>

            <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
              Continuar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;