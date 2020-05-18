import React, { useState, useEffect } from 'react';
import '../css/forms.css';

//Import the basic products and employees from the sales form with the class implementation incase of a localstorage reset

import {jeff, thomas, john, larry, freshLemonade, orangeSplash, sugaryShocker, wildWhiskey} from './sale';

//React component of the Form that allows retreival of all sales between dates and employees

function Forms(){

    //Global react hooks that dynamicaly change with user inputs

    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [products, setProducts] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [sales, setSales] = useState([]);

    //If local storage is empty push the default products and employees

    if(localStorage.getItem('Employees') === null){
        localStorage.setItem('Employees', JSON.stringify([jeff, thomas, john, larry]));
    }
    
    if(localStorage.getItem('Products') === null){
        localStorage.setItem('Products', JSON.stringify([freshLemonade, orangeSplash, sugaryShocker, wildWhiskey]));
    }

    //Life cycle component that fetches the local storage and sets it to the hook on refresh and changes
    useEffect(() =>{
        setEmployees(JSON.parse(localStorage.getItem('Employees')));
    }, [JSON.parse(localStorage.getItem('Employees')).length])

    useEffect(() =>{
        setProducts(JSON.parse(localStorage.getItem('Products')));
    }, [JSON.parse(localStorage.getItem('Products')).length])

    useEffect(() =>{
        setSales(JSON.parse(localStorage.getItem('Sales')));
    }, [JSON.parse(localStorage.getItem('Products')).length])

    //Handles a dynamic change in selected employee

    const handleSelectChange = (e) =>{
        let cur = JSON.parse(e.target.value);
        setSelectedEmployee(cur); 
    }

    //If the user submits form, set the start and end dates to a object and push that to the report generating function if the fields are not null

    const handleReportClick = () =>{
        const start = document.getElementById('startDate');
        const end = document.getElementById('endDate');
        if(start.value === "" || end.value === ""){
            showAlert('Please fill in all of the fields!', 'alert-danger');
        }else{
            const input = {
                start: startDate,
                end: endDate,
                employee: selectedEmployee
            }
            generateReport(input);
            showAlert('Input submited successfuly! Check below for results', 'alert-success');
        }
    }

    //Filters the sales array in localstorage so that the new hook that carries filtered data is of that that includes attributes with the start and end date of the employee
    function generateReport(input){
        let filtered = [];
        sales.forEach(sale =>{
            if(sale.Employee.replace('"', "").replace('"', "") === input.employee.name){
                if(sale.date >= input.start && sale.date <= input.end){
                    filtered.push(sale);
                }
            }
        })
        setEmployeeInfo(filtered)
    }

    //Function that handles rendering of the sold items list
    function soldItemsLister(sale){
        let items = [];
        products.forEach(product =>{
            items.push(product.name.replace(/\s/g, ""));
        })

        return(
            <div>
                {
                    items.map((item,i) =>{
                        return(
                            <p key={i}>{item.replace(/([A-Z])/g, ' $1').trim()}: {sale[item]}</p>
                        )
                    })
                }
            </div>
        )
    }

    // pointer function that returns that total of all filtered sales

    const totalSold = () =>{
        let total = 0;
        if(employeeInfo.length === 0){
            return total;
        }else{
            employeeInfo.map(sale =>{
                total += parseFloat(sale.Total)
            })
    
            return total.toFixed(2);
        }
    }

    // pointer function that returns that total of all filtered commissions

    function totalCommision(){
        let total = 0;
        if(employeeInfo.length === 0){
            return total;
        }else{
            employeeInfo.map(sale =>{
                total += parseFloat(sale.commisionMade);
            })
    
            return total.toFixed(2);
        }
    }

    //Pointer function that retuns the filtered data as a table if it is not null, if there exists no data with the specified attributes, then return there is no data

    const renderInfo = () =>{
        if(employeeInfo.length === 0){
            return(
                <tdody>
                    <tr className="text-centered">
                        <h1 className="display-4 mt-4" id="not-avail">No Sales Are Available With the Specified Info</h1>
                    </tr>
                </tdody>
            )
        }else{
            return(
                employeeInfo.map((sale,i) =>{
                    return(
                        <tbody key={i}>
                            <tr>    
                                <th scope="row" >{sale.date}</th > 
                                <td>
                                    {soldItemsLister(sale)}
                                </td>
                                <td>${sale.Total}</td>
                                <td>${sale.commisionMade}</td>
                            </tr>
                        </tbody>
                    )
                })
            )
        }
    }

    //Function that handeles showing the alerts incase of missing fields or succesfull entries
    
    function showAlert(message, className){
        const saleFormContainer = document.getElementById('card-body');
        const saleForm = document.getElementById('retrieveInfoForm');
        const div = document.createElement('div');
        div.id = "alert";
        div.className = "alert center-text " + className;
        div.appendChild(document.createTextNode(message));

        if(document.getElementById("alert")){
            document.getElementById('alert').remove();
            saleFormContainer.insertBefore(div, saleForm);
            setTimeout(() =>{
                div.remove();
            }, 5000);
        }else{
            saleFormContainer.insertBefore(div, saleForm);
            setTimeout(() =>{
                div.remove();
            }, 5000);
        }
    }

    return(
        <div className="EmployeeForm-body">
            <div className="container">
                <div className="card" id="employeeSalesForm">
                    <div className="card-header text-center">
                        <p className="lead" id="form-title">
                            Retrieve Employee Information
                        </p>
                    </div>
                    <div className="card-body text-center" id="card-body">
                        <form id="retrieveInfoForm">
                            <div className="form-group row" id="dateRow">
                                <div className="mr-auto ml-5" id="start-col">   
                                    <label for="startDate">Start Date</label>
                                    <input type="date" className="form-control" id="startDate" onChange={e => setStartDate(e.target.value)}></input>
                                </div>
                                <div className="ml-auto mr-5" id="end-col">
                                    <label for="endDate">End Date</label>
                                    <input type="date" className="form-control" id="endDate" onChange={e => setEndDate(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="form-group mx-4 mt-5">
                                <label for="employee-selector">
                                    Choose an Employee For the Report
                                </label>
                                <select className="form-control mt-2" onChange={handleSelectChange} defaultValue={JSON.stringify(employees[0])} id="employee-selector">
                                    {
                                        employees.map((employeeInstance,i) =>{
                                            return(
                                                <option value={JSON.stringify(employeeInstance)} key={i}>{employeeInstance.name}</option>
                                            )
                                    })
                                    }
                                </select>
                            </div>
                            <div className="justify-content-center mt-5">
                                <button type="button" className="btn btn-warning" onClick={handleReportClick}>Get Report!</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <table className="table">
                    <thead className="thead" id="table-head">
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Items Sold</th>
                            <th scope="col">Total Price</th>
                            <th scope="col">Commission Earned</th>
                        </tr>
                    </thead>
                    {
                        renderInfo()
                    }
                    <tr>
                        <th scope="row">Total</th>
                        <td></td>
                        <td>${totalSold()}</td>
                        <td>${totalCommision()}</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Forms;