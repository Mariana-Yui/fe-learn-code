import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Me from 'page/Me';
import About from 'page/About';

export default function Home() {
  return (
    <div>
      <div>
        <Link to="/me">ζη</Link>
        <Link to="/about">ε³δΊ</Link>
      </div>
      <Routes>
        <Route path="/me" element={<Me />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
      <h2>Hello World, Mariana</h2>
    </div>
  );
}
