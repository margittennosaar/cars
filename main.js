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
};


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
        cars.push(newCar);

        localStorage.setItem('cars', JSON.stringify(cars));

        displayTable();
        displayMessage("Car added successfully!");

    } catch (error) {
        displayMessage(error.message, "error");
    }
};

const loadCarsFromLocalStorage = () => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
        const parsedCars = JSON.parse(storedCars);
        parsedCars.forEach(carData => {
            cars.push(new Car(carData.license, carData.maker, carData.model, carData.owner, carData.price, carData.color, carData.year));
        });
        displayTable();
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
            ? `€${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", () => deleteCar(index));
        row.insertCell(-1).appendChild(deleteButton);
    });
};

const deleteCar = (index) => {
    cars.splice(index, 1);
    localStorage.setItem('cars', JSON.stringify(cars));
    displayTable();
    displayMessage("Car deleted successfully!");
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
            <p>Original Price: €${originalPrice}</p>
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


