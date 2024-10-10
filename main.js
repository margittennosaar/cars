'use strict';

const addCarForm = document.querySelector('#addCar');
const searchCarForm = document.querySelector('#searchCar');
// declaring global variables to access HTMl elements

const cars = [];        
// declaring empty array for cars

class Car {             
// default class/object constructor defined, 'this' keyword referring to the object values at hand
    constructor(license, maker, model, owner, price, color) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price); // changing string to number
        this.color = color;
    }
}

const addCar = (e) => {     
    // declaring arrow function to add new car object when triggered by event
    e.preventDefault();     
    // method preventing default action after event occurs
    const license = document.querySelector('#license').value.trim();    
    const maker = document.querySelector('#maker').value.trim();
    const model = document.querySelector('#model').value.trim();
    const owner = document.querySelector('#owner').value.trim();
    const price = document.querySelector('#price').value.trim();
    const color = document.querySelector('#color').value;
    // declaring local variables to access HTMl input, 
    // trim() -method returns string without whitespace


    const newCar = new Car(license, maker, model, owner, price, color);  
    // declaring variable name for new objects from the class constructor

    addCarForm.reset(); 
    // method that resets the elements of addcarform object

    cars.push(newCar) 
    // adds current object to cars-array
    displayTable(); 
    // displays current object in table, separate function defined below
}

const displayTable = () => {
    // declaring arrow function to display table

    const table = document.querySelector('#carsTable');
    // declaring local variable to access table element in HTMl

    table.innerHTML = table.rows[0].innerHTML;
    // defining that the HTML table consists of indexed rows

    cars.forEach(car => {
    // for each car object in the cars-array...
        const row = table.insertRow(-1);
        // declaring variable that inserts a row to the end of the table

        Object.values(car).forEach(text => {
        // for each class Car object values...
            const cell = row.insertCell(-1);
            // declaring variable that inserts a cell to the end of the row
            cell.textContent = text;
            // set text content of object value as the content of the cell in HTML
        })
    })
}

const searchCar = (e) => {
    // declaring arrow function for search functionality triggered by event
    e.preventDefault();
   // method preventing default action after event occurs
    const searchInput = document.querySelector('#search').value;
    // declaring variable to access HTML input
    const foundCar = cars.find(car => car.license.toLowerCase() === searchInput.toLowerCase());
    // declaring variable for finding a match to the licence number input written in the search field in any of the Car objects stored in the cars-array
    
    const searchResult = document.querySelector('#searchResult');
    // declaring variable to access HTML element
    if (foundCar) {
    // if there is a match, output/display found Car object's data in HTML (string interpolation of found car's properties)      
        searchResult.innerHTML = `
          <p>Maker: ${foundCar.maker}</p>
          <p>Model: ${foundCar.model}</p>
          <p>Owner: ${foundCar.owner}</p>
          <p>Price: ${foundCar.price.toFixed(2)}€</p>
        `;
    } else {
        searchResult.innerHTML = '<p>No car found with the given license plate.</p>';
        // if no match found, display this message in HTML
    }
}

addCarForm.addEventListener('submit', addCar);
searchCarForm.addEventListener('submit', searchCar);
// listeners for addCar and searchCar functions, triggered by submit button event
