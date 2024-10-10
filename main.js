"use strict";

const addCarForm = document.querySelector("#addCar");
const searchCarForm = document.querySelector("#searchCar");

const cars = [];

class Car {
    constructor(license, maker, model, owner, price, color, year) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price); 
        // converts to float (number with decimals)
        this.color = color;
        this.year = parseInt(year);
        // converts to integer
    }

    // following 3 method functions are part of class Car object constructor:

    getCarAge() {   // function for car's age
        const currentYear = new Date().getFullYear();
        // declaring variable for current year, using new Date() -constructor and getFullYear() -method
        return currentYear - this.year;
        // returns car's age as difference between current year and car manufacturing year stored of the Car object at hand
    } 

    getDiscountedPrice() {  // function for price discount
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price;
        // if age of the Car object at hand is over 10 yrs, calculate 15% off its price; if not, keep the original price
    }

    isEligibleForDiscount() {   //function returns true if car older than 10 yrs
        return this.getCarAge() > 10;
    }

}

const addCar = (e) => {
    e.preventDefault();

    try {   // try-catch runtime error handling for form input when adding a car, if input not valid (input missing, Not a Number, not in range), alert user with appropriate error message
        const license = document.querySelector("#license").value.trim();
        const maker = document.querySelector("#maker").value.trim();
        const model = document.querySelector("#model").value.trim();
        const owner = document.querySelector("#owner").value.trim();
        const price = parseFloat(document.querySelector("#price").value.trim());
        const color = document.querySelector("#color").value.trim();
        const year = parseInt(document.querySelector("#year").value.trim());
        const currentYear = new Date().getFullYear();

        if (!license || !maker || !model || !owner || isNaN(price) || !color || isNaN(year)) {
            throw new Error("All fields are required and must be valid.");
        }

        if (price <= 0) {
            throw new Error("Price must be a positive number.");
        }

        if (year < 1886 || year > currentYear) {
            throw new Error(`Year must be between 1886 and ${currentYear}.`);
        }

        const newCar = new Car(license, maker, model, owner, price, color, year);
        addCarForm.reset();
        cars.push(newCar);
        displayTable();

    } catch (error) {
        alert(error.message);
    }
};

const displayTable = () => {
    const table = document.querySelector("#carsTable");

    table.innerHTML = table.rows[0].innerHTML;

    cars.forEach((car) => {
        const row = table.insertRow(-1);

        const { license, maker, model, owner, year, color, price } = car;

        const carDetails = [license, maker, model, owner, year, color];
        // destructuring car object to extract its properties as carDetails-array

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A';
        }); // insert cell in row and display property text content in it for each car detail, if not available, display 'N/A' in cell

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountedPrice = car.isEligibleForDiscount()
            ? `$${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice;
    }); //insert cell in row to display output of isEligibleForDiscount() function, if true, display calculated discount price, if false, display "No Discount" in cell
};


const searchCar = (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase());

    const searchResult = document.querySelector("#searchResult");

    if (foundCar) { //if search yields result, check for discount and then display all details of found car (string interpolation of p elements below) 
        const originalPrice = foundCar.price.toFixed(2);
        const discountedPrice = foundCar.isEligibleForDiscount()
            ? `$${foundCar.getDiscountedPrice().toFixed(2)}`
            : "No Discount";

        searchResult.innerHTML = `
            <p>Maker: ${foundCar.maker}</p>
            <p>Model: ${foundCar.model}</p>
            <p>Owner: ${foundCar.owner}</p>
            <p>Year: ${foundCar.year}</p>
            <p>Original Price: $${originalPrice}</p>
            <p>Discounted Price: ${discountedPrice}</p>
            <p>Color: ${foundCar.color}</p>
        `;
    } else {
        searchResult.innerHTML = "<p>No car found with the given license plate.</p>";
    }
};

addCarForm.addEventListener("submit", addCar);
searchCarForm.addEventListener("submit", searchCar);