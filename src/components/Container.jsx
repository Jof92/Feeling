// src/components/Container.jsx
import React from 'react';
import Header from './Header';
import PostBox from './PostBox';
import Feed from './Feed';
import Identity from './Identity';
import './Container.css';

const Container = ({ user, onSetFeeling, currentFeeling }) => {
  return (
    <>
      <Header onSetFeeling={onSetFeeling} />
      <div className="main-layout">
        {/* ✅ Passando as props para Identity */}
        <Identity currentFeeling={currentFeeling} onSetFeeling={onSetFeeling} />
        <div className="content-area">
          <PostBox currentFeeling={currentFeeling} />
          <Feed />
        </div>
      </div>
    </>
  );
};

export default Container;