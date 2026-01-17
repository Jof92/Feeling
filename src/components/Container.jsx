// src/components/Container.jsx
import React from 'react';
import Header from './Header';
import PostBox from './PostBox';
import Feed from './Feed';
import Identity from './Identity'; // ← novo
import './Container.css'; // ← vamos criar este CSS

const Container = ({ user, onSetFeeling, currentFeeling }) => {
  return (
    <>
      <Header onSetFeeling={onSetFeeling} />
      <div className="main-layout">
        <Identity />
        <div className="content-area">
          <PostBox currentFeeling={currentFeeling} />
          <Feed />
        </div>
      </div>
    </>
  );
};

export default Container;