import React, { useState, useEffect } from 'react';
import '../css/sale.css';

//Create classes to represent the objects for employees and products
export class Employee{
    constructor(name, position, commision){
        this.name = name;
        this.position = position;
        this.commision = commision/100;
    }
}

export class Product{
    constructor(name, price){
        this.name = name;
        this.price = price;
    }
}

//Create objects for each employee
export const jeff = new Employee("Jeff Terry", "Senior", 10);
export const thomas = new Employee("Thomas Black", "Manager", 20);
export const john = new Employee("John Rice", "Junior", 5);
export const larry = new Employee("Larry Long", "Junior", 0);

//Create objects for each product
export const freshLemonade = new Product('Fresh Lemon Lemonade', 1.50);
export const orangeSplash = new Product('Orange And Lemon Splash', 2.00);
export const sugaryShocker = new Product('Sugary Shocker', 3.00);
export const wildWhiskey = new Product('Wild Whiskey Whack', 5.50);

if(localStorage.getItem('Employees') === null){
    localStorage.setItem('Employees', JSON.stringify([jeff, thomas, john, larry]));
}

if(localStorage.getItem('Products') === null){
    localStorage.setItem('Products', JSON.stringify([freshLemonade, orangeSplash, sugaryShocker, wildWhiskey]));
}
function Sale(){
    //Hooks that hold global variables that change based on user input
    const [runningTotal, setRunningTotal] = useState(0);
    let curPrice;
    let selectedEmployee;
    const [curPurchaseSheet, setCurPurchaseSheet] = useState({
            FreshLemonLemonade: 0,
            OrangeAndLemonSplash: 0,
            SugaryShocker: 0,
            WildWhiskeyWhack: 0,
            Total: 0,
            Employee: "",
            commisionMade: 0,
            date: ''
    })
    const[newEmployeeName, setNewEmployeeName] = useState('');
    const[newEmployeeRole, setNewEmployeeRole] = useState('');
    const[newEmployeeCommision, setNewEmployeeCommision] = useState(0);

    const[newProductName, setNewProductName] = useState('');
    const[newProductPrice, setNewProductPrice] = useState(0);

    const [employees, setEmployees] = useState(JSON.parse(localStorage.getItem('Employees')));
    const [products, setProducts] = useState(JSON.parse(localStorage.getItem('Products')));

    const [changedPrice, setChangedPrice] = useState(0);
    const [changingProduct, setChangingProduct] = useState('');

    const [saleDate, setSaleDate] = useState('');

    useEffect(() =>{
        setEmployees(JSON.parse(localStorage.getItem('Employees')));
    }, [JSON.parse(localStorage.getItem('Employees')).length])

    useEffect(() =>{
        setProducts(JSON.parse(localStorage.getItem('Products')));
    }, [JSON.parse(localStorage.getItem('Products')).length])


    function addEmployee(e){
        e.preventDefault();
        if(newEmployeeName === "" || newEmployeeRole === ""){
            showAddAlert('Please fill in all of the fields!', 'alert-danger');
        }else{
            let temp = JSON.parse(localStorage.getItem('Employees'));
            temp.push(new Employee(newEmployeeName, newEmployeeRole, newEmployeeCommision));
            temp = JSON.stringify(temp);
            localStorage.setItem('Employees', temp);
            setNewEmployeeName('');
            setNewEmployeeRole('');
            setNewEmployeeCommision(0);
            document.getElementById('newEmployeeName').value = ""
            document.getElementById('newEmployeeRole').value = ""
            document.getElementById('newEmployeeCommision').value = ""
            showAddAlert('New Employee Successfuly added!', 'alert-success');
        }
    }
    
    function addProduct(e){
        e.preventDefault();
        if(newProductName === "" || newProductPrice === 0){
            showAddAlert('Please fill in all of the fields!', 'alert-danger');
        }else{
            let temp = JSON.parse(localStorage.getItem('Products'));
            temp.push(new Product(newProductName, parseFloat(newProductPrice)));
            temp = JSON.stringify(temp);
            localStorage.setItem('Products', temp);
            setNewProductName('');
            setNewProductPrice(0);
            document.getElementById('newProductName').value = ""
            document.getElementById('newProductPrice').value = ""
            showAddAlert('New Product Successfuly added!', 'alert-success');
        }
    }

    const handleProductChange = (e, product) =>{
        let curTotal = runningTotal;
        let curProduct = e.target.id.replace(/\s/g, "");
        let tempPurchaseSheet = curPurchaseSheet;
        tempPurchaseSheet[curProduct] = e.target.value;

        if(e.target.value === ""){
            setRunningTotal(0);
            let remainder = 0;
            products.map(product =>{
                if(document.getElementById(product.name).value === ""){
                    remainder += 0;
                }else{
                    remainder+= document.getElementById(product.name).value === ""
                }
            })
            setRunningTotal(remainder);
        }else{
            setRunningTotal((parseFloat(curTotal)) + (parseFloat(e.target.value) * product.price));
            curPrice = parseFloat(e.target.value) * product.price;
            tempPurchaseSheet["Total"]+= parseFloat(e.target.value) * product.price;
            setCurPurchaseSheet(tempPurchaseSheet);
        }
    }

    const handleSelectChange = (e) =>{
        let cur = JSON.parse(e.target.value);
        let tempPurchaseSheet = curPurchaseSheet;
        tempPurchaseSheet["Employee"] = JSON.stringify(cur.name);
        setCurPurchaseSheet(tempPurchaseSheet);
        selectedEmployee = cur;
    }

    const handleSubmit = () =>{
        //Set commision made in the purchase object
        let tempPurchaseSheet = curPurchaseSheet;
        let commision;
        tempPurchaseSheet.Total = tempPurchaseSheet.Total.toFixed(2);

        employees.forEach(employee =>{
            if(JSON.stringify(employee.name) === tempPurchaseSheet.Employee){
                commision = employee.commision
            }
        })

        let made = (commision * tempPurchaseSheet.Total).toFixed(2);
        tempPurchaseSheet.commisionMade = made;
        tempPurchaseSheet.date = saleDate;
        setCurPurchaseSheet(tempPurchaseSheet);

        if(localStorage.getItem('Sales') !== null){
            let tempLocal = JSON.parse(localStorage.getItem('Sales'));
            tempLocal.push(curPurchaseSheet);
            tempLocal = JSON.stringify(tempLocal);
            localStorage.setItem('Sales', tempLocal);
        }else{
            let purchases = [];
            purchases.push(curPurchaseSheet);
            localStorage.setItem('Sales', JSON.stringify(purchases));
        }
        clearInputs();
        setCurPurchaseSheet({
            FreshLemonLemonade: 0,
            OrangeAndLemonSplash: 0,
            SugaryShocker: 0,
            WildWhiskeyWhack: 0,
            Total: 0,
            Employee: "",
            commisionMade: 0,
            date: ''
        })

        setRunningTotal(0);
        selectedEmployee = null;
        showAlert('Purchase was succesfully made!', 'alert-success');

    }

    const handleRedo = () =>{
        clearInputs();
        showAlert('Please try again', 'alert-warning');
        setCurPurchaseSheet({
            FreshLemonLemonade: 0,
            OrangeAndLemonSplash: 0,
            SugaryShocker: 0,
            WildWhiskeyWhack: 0,
            Total: 0,
            Employee: "",
            commisionMade: 0,
            date: ''
        })

        setRunningTotal(0);
        selectedEmployee = null;
    }

    function clearInputs(){
        const selector = document.getElementById('employee-selector');
        selector.value = null;

        products.map(product =>{
            document.getElementById(product.name).value = "";
        })

        document.getElementById('saleDate').value = "";
    }

    function showAlert(message, className){
        const saleFormContainer = document.getElementById('sale-form-container');
        const saleForm = document.getElementById('sale-form');
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

    function showAddAlert(message, className){
        const saleFormContainer = document.getElementById('add-body');
        const saleForm = document.getElementById('add-row');
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

    const changePrice = () =>{
        if(changedPrice === 0){
            showAddAlert('Please change the price!', 'alert-danger');
        }else{
            let temp = JSON.parse(localStorage.getItem('Products'));
            temp.forEach(product =>{
                if(product.name.toLowerCase() === changingProduct){
                    product.price = parseFloat(changedPrice);
                }
            })
            temp = JSON.stringify(temp);
            localStorage.setItem('Products', temp);
            showModalAlert('Price Successfuly changed', 'alert-success');
            window.location.reload();
        }

    }

    function showModalAlert(message, className){
        const saleFormContainer = document.getElementById('modalBody');
        const saleForm = document.getElementById('changePriceForm');
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
        <div className="body mb-5">
            <div className="container">
                <div className="card">
                    <div className="card-header text-center">
                        <p className="lead" id="sale-title">
                            Check a Customer Out!
                        </p>
                    </div>
                    <div className="card-body text-center">
                        <div className="container" id="sale-form-container">
                            <form id="sale-form">
                                <div className="form-group">
                                    <label for="employeeInputCheckout">Choose an employee who is checking the customer out</label>
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
                                <br />
                                <div className="form-group">
                                    <label for="saleData">Date:</label>
                                    <input type="date" className="form-control" id="saleDate" onChange={e => setSaleDate(e.target.value)}></input>
                                </div>
                                <br />
                                <div className="form-group mb-5">
                                    <ul className="list-group">
                                         {
                                        products.map((product, i) =>{
                                            return(
                                                <div className="row text-center justify-content-center mt-2" key={i}>
                                                    <div className="col-sm">
                                                        <h4>{product.name}</h4>
                                                    </div>
                                                    <div className="col-sm">
                                                        <h4>{product.price.toFixed(2)}</h4>
                                                    </div>  
                                                    <div className="col-sm" style={{display: 'flex', flexDirection: 'column'}}>
                                                        <label for={product.name}>Quantity</label>
                                                        <input type="number" id={product.name} onChange={e => handleProductChange(e, product)}></input>
                                                    </div>
                                                    <div className='col-sm'>
                                                        <button type="button" className="btn btn-outline-success" id={product.name.toLowerCase()} onClick={e => setChangingProduct(e.target.id)} data-toggle="modal" data-target="#changePriceModal">Edit Price</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </ul>
                                </div>
                                <div id="totalDiv">
                                    <h4 id="dynamicTotal mr-5">Total: ${runningTotal.toFixed(2)}</h4>
                                    <button className="btn btn-success ml-5" type="button" onClick={handleSubmit}>Checkout!</button>
                                    <button className="btn btn-outline-danger ml-5" type="button" onClick={handleRedo}>Restart!</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="card" id="adding-card">
                    <div className="card-header text-center">
                        <p className="lead" id="add-title">
                            Add a new Employee or Product
                        </p>
                    </div>
                    <div className="card-body justify-content-center text-center" id="add-body">
                        <div className="row" id="add-row">
                            <div className="col-lg" style={{borderRight: '1px solid yellow'}}>
                                <form id="add-employee-form">
                                    <h1 className="heading-4" id="add-employee-title">
                                        <strong>Add Employee</strong>
                                    </h1>
                                    <div className="form-group mt-3">
                                        <label for="newEmployeeName">
                                            Name
                                        </label>
                                        <input type="text" id="newEmployeeName" placeholder="e.g. Sarah Newport" className="form-control" onChange={(e) => setNewEmployeeName(e.target.value)}></input>
                                    </div>
                                    <div className="form-group">
                                        <label for="newEmployeeRole">
                                            Role
                                        </label>
                                        <input type="text" id="newEmployeeRole" placeholder="e.g. Manager" className="form-control" onChange={e => setNewEmployeeRole(e.target.value)}></input>
                                    </div>
                                    <div className="form-group">
                                        <label for="newEmployeeCommision">
                                            Commision (%)
                                        </label>
                                        <input type="number" id="newEmployeeCommision" placeholder="e.g. 15" className="form-control" onChange={e => setNewEmployeeCommision(e.target.value)}></input>
                                    </div>
                                    <button type="submit" className="btn btn-warning mt-2" onClick={e => addEmployee(e)}>Add!</button>
                                </form>
                            </div>
                            <div className="col-lg" style={{borderLeft: '1px solid yellow'}}>
                                <form id="add-product-form">
                                    <h1 className="heading-4" id="add-product-title">
                                        <strong>Add Product</strong>
                                    </h1>
                                    <div className="form-group mt-3">
                                        <label for="newProductName">
                                            Name
                                        </label>
                                        <input type="text" id="newProductName" placeholder="e.g. Raspberry Lemonade" className="form-control" onChange={e => setNewProductName(e.target.value)}></input>
                                    </div>
                                    <div className="form-group">
                                        <label for="newProductPrice">
                                            price($)
                                        </label>
                                        <input type="text" id="newProductPrice" placeholder="e.g. 3.50" className="form-control" onChange={e => setNewProductPrice(e.target.value)}></input>
                                    </div>
                                    <button type="submit" className="btn btn-warning mt-2" onClick={e => addProduct(e)}>Add!</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="changePriceModal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h5 className="modal-title">Change The Price</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" id="modalBody">
                            <form id="changePriceForm">
                                <div className="form-group">
                                    <label for="newPrice">
                                        New Price
                                    </label>
                                    <input type="number" className="form-control" onChange={e => setChangedPrice(e.target.value)}></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-warning" onClick={changePrice}>Change!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sale;