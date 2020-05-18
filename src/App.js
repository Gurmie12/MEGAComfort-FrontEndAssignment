import React from 'react';
import './css/App.css';
import Forms from './pages/forms.js';
import Sale from './pages/sale.js';
import logo from './img/logo.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

AOS.init({duration: 500});


function App() {

  
  return (
    <div className="body">
      <div className="container mt-4">
        <div className="container justify-content-center text-center mt-5 mb-5" id="title-container">
          <div>
            <img
            src={logo}
            alt="logo-home"
            >
            </img>
          </div>
          <div className="mt-2" data-aos="zoom-in">
            <h1 className="heading-4" id="home-title">
              <strong>Lemonade </strong>
              <span id="home-title-span">Stand</span>
            </h1>
          </div>
        </div>
        <br/>
        <br/>
        <div className="container mt-5">
          <Router>
            <div className="row text-center" data-aos="zoom-out">
              <div className="col-sm text-center">
                <button className="btn btn-warning" id="sale-button">
                  <Link to="/sale" id="link">Make a Sale</Link>
                </button>
              </div>
              <div className="col-sm text-center">
                <button className="btn btn-success" id="form-button">
                  <Link to="/form" id="link">Employee Sales Form</Link>
                </button>
              </div>
            </div>
            <br/>
            <div className="mt-5">
              <Route path="/sale" component={Sale} />
              <Route path="/form" component={Forms} />
            </div>
          </Router>
        </div>
      </div>
    </div>




  );
}

export default App;
