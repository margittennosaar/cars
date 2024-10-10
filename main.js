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
        this.color = color;
        this.year = parseInt(year);
    }

    getCarAge() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }

    getDiscountedPrice() {
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price;
    }

    isEligibleForDiscount() {
        return this.getCarAge() > 10;
    }

}

const displayMessage = (message, type = "success") => {
    const messageElement = document.querySelector("#message");
    messageElement.textContent = message;
    messageElement.className = type;
    setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "";
    }, 3000);
};  // arrow function for output message to user if car added/deleted successfully, message and its type (strings) displayed in HTML element with 3 second delay after event (setTimeout() method + anonymous function)


const addCar = (e) => {
    e.preventDefault();

    try {
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
        // reset() method to empty form input fields
        cars.push(newCar);

        localStorage.setItem('cars', JSON.stringify(cars));
        // store key-value pair in local storage (key: cars, value: stringified cars-array) 

        displayTable();
        displayMessage("Car added successfully!");
        // run displayMessage() function with this string to confirm to user that car added

    } catch (error) {
        displayMessage(error.message, "error");
        // run displayMessage() function to error message, message type "error"
    }
};

const loadCarsFromLocalStorage = () => {
// declaring arrow function to retrieve cars-array from local storage
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
        const parsedCars = JSON.parse(storedCars);
        parsedCars.forEach(carData => {
            cars.push(new Car(carData.license, carData.maker, carData.model, carData.owner, carData.price, carData.color, carData.year));
        });
        displayTable();
        // if there are items in the storage with key 'cars', parse the returned string and restructure it to class Car objects and their properties, then add them again to the cars array and run function to display them in HTML table   
    }
};

const displayTable = () => {
    const table = document.querySelector("#carsTable");

    table.innerHTML = table.rows[0].innerHTML;

    cars.forEach((car, index) => {
        const row = table.insertRow(-1);

        const { license, maker, model, owner, year, color, price } = car;

        const carDetails = [license, maker, model, owner, year, color];

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A';
        });

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountedPrice = car.isEligibleForDiscount()
            ? `$${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice;

        const deleteButton = document.createElement("button");
        // declaring variable to create button in HTML
        deleteButton.textContent = "Delete";
        // inserting text "Delete" on button
        deleteButton.classList.add("delete");
        // adding class property "delete" to button
        deleteButton.addEventListener("click", () => deleteCar(index));
        // event listener for button, when clicked, will run deleteCar function 
        row.insertCell(-1).appendChild(deleteButton);
        // inserting cell at the end of row and appending button to it
    });
};

const deleteCar = (index) => {
// declaring arrow function to delete car object with given index from cars-array
    cars.splice(index, 1); 
    // extract car with given index, extract only one item from array
    localStorage.setItem('cars', JSON.stringify(cars));
    // store key-value pair in local storage (key: cars, value: stringified cars-array)
    displayTable();
    // run displayTable function to display table now without row for deleted car object
    displayMessage("Car deleted successfully!");
    // run displayMessage function to alert user that deletion was successful
};


const searchCar = (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase());

    const searchResult = document.querySelector("#searchResult");

    if (foundCar) {
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
window.addEventListener('load', loadCarsFromLocalStorage);
// event listener, when window loaded, function will run to retrieve stored car objects from local storage and display them in HTML table