import React, { useState, useEffect } from 'react';
import './css/App.css';
import Forms from './pages/forms.js';
import Sale from './pages/sale.js';
import logo from './img/logo.png';
import AOS from 'aos';
import '@fortawesome/fontawesome-free/css/all.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {jeff, thomas, john, larry, freshLemonade, orangeSplash, sugaryShocker, wildWhiskey} from './pages/sale';




function App() {

  //Keeping hooks for the dynamicaly changing products and employee storages in local storage
  const [products, setProducts] = useState([]);
  const [Employees, setEmployees] = useState([]);

  //Fetch the employee and product arrays from local storage on change of length or on re-render
  useEffect(() =>{
    setProducts(JSON.parse(localStorage.getItem('Products')));
  }, [JSON.parse(localStorage.getItem('Products')).length])

  useEffect(() =>{
    setEmployees(JSON.parse(localStorage.getItem('Employees')));
  }, [JSON.parse(localStorage.getItem('Employees')).length])


  if(localStorage.getItem('Employees') === null){
    localStorage.setItem('Employees', JSON.stringify([jeff, thomas, john, larry]));
  }

  if(localStorage.getItem('Products') === null){
      localStorage.setItem('Products', JSON.stringify([freshLemonade, orangeSplash, sugaryShocker, wildWhiskey]));
  } 


  //Render function that finds the product with the most sales. 

  function findTopProduct(){  
    if(localStorage.getItem('Sales') === null){
      return(
        "There are no sales"
      )
    }else{
      let sales = JSON.parse(localStorage.getItem('Sales'));

      //Each index in this array holds the same index as the products array and tracks the total sold ammount

      let helperAmount = [];
      let helperName = [];

      for(let k = 0; k < products.length; k++){
        helperAmount.push(0);
      };

      for(let n = 0; n < products.length; n++){
        helperName.push(products[n].name);
      }

      //Add the amount sold to the specfic name index
      for(let i = 0; i < sales.length; i++){
        for(let j = 0; j < products.length; j++){
          if(sales[i][products[j].name.replace(/ +/g, "")] !== undefined){
            helperAmount[j] += parseFloat(sales[i][products[j].name.replace(/ +/g, "")]);
          }
        };
      };

      //Find the max of the array
      let indexOfMax = helperAmount.indexOf(Math.max(...helperAmount));
      return(
        helperName[indexOfMax]
      )

      }
    }


  //Render function that finds the top employee based on the overall $ of sales
  function findTopEmployee(){

      if(localStorage.getItem('Sales') === null){
        return(
          'There are no sales!'
        )
      }else{

        let sales = JSON.parse(localStorage.getItem('Sales'));
        let helperNames = [];
        let helperAmount = [];

        for(let i = 0; i < Employees.length; i++){
          helperNames.push(Employees[i].name);
        }
        for(let k = 0; k < Employees.length; k++){
          helperAmount.push(0);
        }

        for(let j = 0; j < sales.length; j++){
          for(let x = 0; x < helperNames.length; x++){
            let temp = sales[j].Employee.replace('"', "");
            temp = temp.replace('"', "");
            if(temp === helperNames[x]){
              helperAmount[x] += parseFloat(sales[j].Total);
            }
          }
        }

        let indexOfMax = helperAmount.indexOf(Math.max(...helperAmount));

        return(
          helperNames[indexOfMax]
        )
      }
  }

  return (
    <div className="body">
      <nav class="navbar navbar-expand-lg">
        <div className="mt-3 mr-auto" id="top-container">
          <span class="badge" id="topP-badge">
            <i className="fa fa-lemon" style={{color: '#FFE933'}}>  Top Product: </i>
            <strong id="topP-name"> {findTopProduct()}</strong>
          </span>
          <span class="badge mt-2" id="topE-badge">
            <i className="fa fa-user-check" style={{color: '#129E25'}}>  Top Employee: </i>
            <strong id="topE-name"> {findTopEmployee()}</strong>
          </span>
        </div>
        <div className="ml-auto" id="customerService-div">
           <div id="star-div" className="justify-content-center">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
           </div>
           <div className="text-center mt-2">
            <h4 id="tips-title"><strong>In customer service</strong></h4>
            <p id="tips"><strong>Ask: </strong>"How are you today?"</p>
            <p id="tips"><strong>Be: </strong>Kind and understanding</p>
            <p id="tips"><strong>Always: </strong>Keep a smile</p>
           </div>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="container justify-content-center text-center mt-5 mb-5" id="title-container">
          <div>
            <a href="/">
            <img
            src={logo}
            alt="logo-home"
            >
            </img>
            </a>
          </div>
          <div className="mt-2">
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
            <div className="row text-center">
              <div className="col-sm text-center">
                <button className="btn btn-warning" id="sale-button">
                  <Link to="/sale" id="link1">Make a Sale</Link>
                </button>
              </div>
              <div className="col-sm text-center">
                <button className="btn btn-success" id="form-button">
                  <Link to="/form" id="link2">Employee Sales Form</Link>
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
