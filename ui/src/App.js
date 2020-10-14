import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import InputField from './InputField.js';

function App() {
  return (
    <div className="App">
      <header className = "logo">
        <h1>LibriListen</h1>
      </header>

      <p className="regular-text">
        Welcome to LibriListen! Navigate to https://librivox.org/search/ and pick out a book. Enter it below to generate a scheduled podcast feed.
      </p>

      <InputField initialText="Librivox Link" />

    </div>
  );
}

export default App;
