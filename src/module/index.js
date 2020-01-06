import React, { useRef } from 'react';
import FitBox from '../lib';
import { ReactComponent as Logo } from './assets/logo.svg';
import './demo.css';

const App = () => {

  const containerRef = useRef();

  return (
    <div className="app" style={{ height: "100vh", width: "100vw" }}>
      <div className="nav"><Logo /></div>
      <div ref={containerRef} className="container">
        <FitBox ratio={.5} size={{ h: 360, w: 500 }} fitWidth container={containerRef} >
          <div className="whitebox"></div>
          <span className="text">500px x 360px</span>
        </FitBox>
      </div>
    </div>
  )
};

export default App;