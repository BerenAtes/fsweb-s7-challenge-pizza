import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="home-container">
      <header>
        <h1>Teknolojik Yemekler</h1>
        <nav className="navbar">
          <Link to="/">Anasayfa -</Link>
          <a href="#">Secenekler - </a>
          <a href="#">
            <b>Siparis Olustur</b>
          </a>
        </nav>
      </header>
    </div>
  );
};

export default Header;
