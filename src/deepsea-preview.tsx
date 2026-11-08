import React from 'react';
import ReactDOM from 'react-dom/client';
import DeepSea from './components/DeepSea';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><DeepSea/><main style={{ position: 'relative', zIndex: 10, minHeight: '400vh', padding: '20vh 8vw' }}><h1 style={{ fontSize: 'clamp(40px,6vw,80px)', maxWidth: '700px', fontFamily: 'Exo 2' }}>Uma conexão que vai mais longe.</h1><p style={{ maxWidth: '460px', marginTop: 24, color: '#d0deed' }}>Prévia técnica do fundo. Role para acompanhar a fibra do leito marinho até a costa.</p><p style={{ position: 'absolute', bottom: '25vh', fontSize: 32 }}>A fibra chega à terra.</p></main></React.StrictMode>);
