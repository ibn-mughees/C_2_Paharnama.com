/* ==========================================================================
   PaharNama Transportation Page Script
   Handles vehicle card creation, dropdown population, vehicle selection,
   form validation, fare calculation, and localStorage memory.
   ========================================================================== */

/* ==========================================================================
   1. Data Arrays (Vehicles and Destinations)
   ========================================================================== */

/* Array of vehicle objects used to build cards and the Car dropdown */
const vehicles = [
  {
    id: "toyota-hiace",
    name: "Toyota Hiace",
    seats: 12,
    pricePerDay: 18000,
    category: "Group Tour Van"
  },
  {
    id: "land-cruiser",
    name: "Land Cruiser",
    seats: 6,
    pricePerDay: 30000,
    category: "4x4 Mountain SUV"
  },
  {
    id: "toyota-corolla",
    name: "Toyota Corolla",
    seats: 4,
    pricePerDay: 12000,
    category: "Comfort Sedan"
  }
];

/* Array of destination objects with their surcharge in PKR */
const destinations = [
  {
    id: "gilgit",
    name: "Gilgit",
    surcharge: 15000
  },
  {
    id: "skardu",
    name: "Skardu",
    surcharge: 20000
  },
  {
    id: "chitral",
    name: "Chitral",
    surcharge: 18000
  },
  {
    id: "hunza",
    name: "Hunza",
    surcharge: 17000
  }
];

/* Keys used to save and load data in browser localStorage */
const STORAGE_KEY_SELECTED_CAR = "paharnama_selected_car";
const STORAGE_KEY_LAST_FARE = "paharnama_last_fare";

/* ==========================================================================
   2. Helper Functions
   ========================================================================== */

/* Formats a number into PKR currency with thousand separators (e.g. PKR 18,000) */
function formatPKR(amount) {
  return "PKR " + amount.toLocaleString("en-US");
}

/* Finds and returns a vehicle object from the vehicles array by its ID */
function findVehicleById(vehicleId) {
  for (let i = 0; i < vehicles.length; i++) {
    if (vehicles[i].id === vehicleId) {
      return vehicles[i];
    }
  }
  return null;
}

/* Finds and returns a destination object from the destinations array by its ID */
function findDestinationById(destinationId) {
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i].id === destinationId) {
      return destinations[i];
    }
  }
  return null;
}

/* ==========================================================================
   3. Building Vehicle Cards and Dropdown Options
   ========================================================================== */

/* Creates and displays all vehicle cards from the vehicles array */
function renderVehicleCards() {
  const container = document.getElementById("vehicle-cards-container");
  container.innerHTML = "";

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    /* Bootstrap responsive column (3 in a row on medium+ screens, stacked on mobile) */
    const column = document.createElement("div");
    column.className = "col-12 col-md-4";

    /* Card box */
    const card = document.createElement("article");
    card.className = "vehicle-card";
    card.setAttribute("data-vehicle-id", vehicle.id);

    /* Top section of the card */
    const cardTop = document.createElement("div");

    /* Image placeholder with accessible role and label */
    const imagePlaceholder = document.createElement("div");
    imagePlaceholder.className = "vehicle-image-placeholder";
    imagePlaceholder.setAttribute("role", "img");
    imagePlaceholder.setAttribute("aria-label", vehicle.name + " vehicle image placeholder");

    const badge = document.createElement("span");
    badge.className = "vehicle-placeholder-badge";
    badge.textContent = vehicle.category;

    const placeholderTitle = document.createElement("div");
    placeholderTitle.className = "vehicle-placeholder-name";
    placeholderTitle.textContent = vehicle.name;

    const placeholderNote = document.createElement("div");
    placeholderNote.className = "vehicle-placeholder-caption";
    placeholderNote.textContent = "Vehicle Preview";

    imagePlaceholder.appendChild(badge);
    imagePlaceholder.appendChild(placeholderTitle);
    imagePlaceholder.appendChild(placeholderNote);

    /* Vehicle name heading */
    const title = document.createElement("h3");
    title.className = "vehicle-title";
    title.textContent = vehicle.name;

    /* Number of seats */
    const seatsText = document.createElement("p");
    seatsText.className = "vehicle-seats";
    seatsText.textContent = vehicle.seats + " seats";

    /* Daily rental price */
    const priceText = document.createElement("p");
    priceText.className = "vehicle-price";
    priceText.textContent = formatPKR(vehicle.pricePerDay) + " per day";

    cardTop.appendChild(imagePlaceholder);
    cardTop.appendChild(title);
    cardTop.appendChild(seatsText);
    cardTop.appendChild(priceText);

    /* Select button at the bottom of the card */
    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "btn btn-sunrise w-100 vehicle-select-btn";
    selectButton.textContent = "Select";
    selectButton.setAttribute("aria-pressed", "false");

    /* Clicking the button selects this vehicle */
    selectButton.addEventListener("click", function (event) {
      event.stopPropagation();
      selectVehicle(vehicle.id);
    });

    /* Clicking anywhere on the card also selects this vehicle */
    card.addEventListener("click", function () {
      selectVehicle(vehicle.id);
    });

    card.appendChild(cardTop);
    card.appendChild(selectButton);
    column.appendChild(card);
    container.appendChild(column);
  }
}

/* Fills the Car and Destination dropdowns using the JavaScript arrays */
function populateDropdowns() {
  const carSelect = document.getElementById("car-select");
  const destinationSelect = document.getElementById("destination-select");

  /* Add default placeholder option for Car dropdown */
  carSelect.innerHTML = "";
  const defaultCarOption = document.createElement("option");
  defaultCarOption.value = "";
  defaultCarOption.textContent = "-- Select a Car --";
  carSelect.appendChild(defaultCarOption);

  /* Add each vehicle to the Car dropdown */
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = vehicle.name + " (" + vehicle.seats + " seats - " + formatPKR(vehicle.pricePerDay) + "/day)";
    carSelect.appendChild(option);
  }

  /* Add default placeholder option for Destination dropdown */
  destinationSelect.innerHTML = "";
  const defaultDestOption = document.createElement("option");
  defaultDestOption.value = "";
  defaultDestOption.textContent = "-- Select a Destination --";
  destinationSelect.appendChild(defaultDestOption);

  /* Add each destination to the Destination dropdown */
  for (let j = 0; j < destinations.length; j++) {
    const destination = destinations[j];
    const option = document.createElement("option");
    option.value = destination.id;
    option.textContent = destination.name + " (+" + formatPKR(destination.surcharge) + " surcharge)";
    destinationSelect.appendChild(option);
  }
}

/* ==========================================================================
   4. Vehicle Selection & Card Highlighting
   ========================================================================== */

/* Highlights the selected vehicle card, updates its button, and syncs the Car dropdown */
function selectVehicle(vehicleId) {
  const selectedVehicle = findVehicleById(vehicleId);
  if (!selectedVehicle) {
    return;
  }

  /* Update every card's border and button appearance */
  const allCards = document.querySelectorAll(".vehicle-card");
  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    const cardVehicleId = card.getAttribute("data-vehicle-id");
    const button = card.querySelector(".vehicle-select-btn");

    if (cardVehicleId === vehicleId) {
      card.classList.add("selected");
      button.className = "btn btn-selected w-100 vehicle-select-btn";
      button.textContent = "✓ Selected";
      button.setAttribute("aria-pressed", "true");
    } else {
      card.classList.remove("selected");
      button.className = "btn btn-sunrise w-100 vehicle-select-btn";
      button.textContent = "Select";
      button.setAttribute("aria-pressed", "false");
    }
  }

  /* Pre-select the matching car in the dropdown and clear any car error */
  const carSelect = document.getElementById("car-select");
  carSelect.value = vehicleId;
  clearSingleFieldError(carSelect, document.getElementById("car-error"));

  /* Save the selected car in localStorage */
  saveSelectedCarToStorage(vehicleId);
}

/* Clears all vehicle card highlights when no valid car is selected */
function clearVehicleSelection() {
  const allCards = document.querySelectorAll(".vehicle-card");

  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    const button = card.querySelector(".vehicle-select-btn");
    card.classList.remove("selected");
    button.className = "btn btn-sunrise w-100 vehicle-select-btn";
    button.textContent = "Select";
    button.setAttribute("aria-pressed", "false");
  }
}

/* ==========================================================================
   5. Form Validation & Fare Calculation
   ========================================================================== */

/* Shows an inline error message below an input field */
function showFieldError(inputElement, errorElement, message) {
  inputElement.classList.add("is-invalid");
  inputElement.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

/* Clears the error message and invalid border from a single input field */
function clearSingleFieldError(inputElement, errorElement) {
  inputElement.classList.remove("is-invalid");
  inputElement.removeAttribute("aria-invalid");
  errorElement.textContent = "";
}

/* Clears all error messages on the fare form */
function clearAllErrors() {
  clearSingleFieldError(document.getElementById("car-select"), document.getElementById("car-error"));
  clearSingleFieldError(document.getElementById("days-input"), document.getElementById("days-error"));
  clearSingleFieldError(document.getElementById("destination-select"), document.getElementById("destination-error"));
}

/* Validates Car, Days (1 to 30), and Destination inputs; returns true if all are valid */
function validateFareForm() {
  clearAllErrors();

  const carSelect = document.getElementById("car-select");
  const daysInput = document.getElementById("days-input");
  const destinationSelect = document.getElementById("destination-select");

  const carError = document.getElementById("car-error");
  const daysError = document.getElementById("days-error");
  const destinationError = document.getElementById("destination-error");

  let isValid = true;

  /* Check if a car is chosen */
  if (!findVehicleById(carSelect.value)) {
    showFieldError(carSelect, carError, "Please choose a car before calculating the fare.");
    isValid = false;
  }

  /* Check if days is filled and between 1 and 30 */
  const rawDays = daysInput.value.trim();
  const parsedDays = Number(rawDays);

  if (rawDays === "") {
    showFieldError(daysInput, daysError, "Please enter the number of days.");
    isValid = false;
  } else if (isNaN(parsedDays) || !Number.isInteger(parsedDays)) {
    showFieldError(daysInput, daysError, "Please enter a whole number of days.");
    isValid = false;
  } else if (parsedDays < 1) {
    showFieldError(daysInput, daysError, "Number of days must be at least 1.");
    isValid = false;
  } else if (parsedDays > 30) {
    showFieldError(daysInput, daysError, "Number of days cannot be more than 30.");
    isValid = false;
  }

  /* Check if a destination is chosen */
  if (!findDestinationById(destinationSelect.value)) {
    showFieldError(destinationSelect, destinationError, "Please select a destination.");
    isValid = false;
  }

  return isValid;
}

/* Displays the itemized fare breakdown and total inside the Fare result box */
function displayFareResult(vehicle, days, destination, totalFare) {
  const resultContainer = document.getElementById("fare-result-content");
  const rentalCost = vehicle.pricePerDay * days;

  resultContainer.innerHTML = "";

  /* Format the days label cleanly as singular or plural */
  let dayWord = "days";
  if (days === 1) {
    dayWord = "day";
  }

  /* List of breakdown rows */
  const list = document.createElement("ul");
  list.className = "fare-breakdown-list";

  const rows = [
    {
      label: "Selected Car",
      value: vehicle.name + " (" + formatPKR(vehicle.pricePerDay) + " / day)"
    },
    {
      label: "Trip Duration",
      value: days + " " + dayWord
    },
    {
      label: "Vehicle Rental (" + formatPKR(vehicle.pricePerDay) + " x " + days + ")",
      value: formatPKR(rentalCost)
    },
    {
      label: destination.name + " Surcharge",
      value: formatPKR(destination.surcharge)
    }
  ];

  for (let i = 0; i < rows.length; i++) {
    const item = document.createElement("li");
    item.className = "fare-breakdown-item";

    const labelSpan = document.createElement("span");
    labelSpan.className = "fare-breakdown-label";
    labelSpan.textContent = rows[i].label;

    const valueSpan = document.createElement("span");
    valueSpan.className = "fare-breakdown-value";
    valueSpan.textContent = rows[i].value;

    item.appendChild(labelSpan);
    item.appendChild(valueSpan);
    list.appendChild(item);
  }

  /* Highlighted total row */
  const totalBox = document.createElement("div");
  totalBox.className = "fare-total-row";

  const totalLabel = document.createElement("span");
  totalLabel.className = "fare-total-label";
  totalLabel.textContent = "Total Estimated Fare";

  const totalAmount = document.createElement("span");
  totalAmount.className = "fare-total-amount";
  totalAmount.textContent = formatPKR(totalFare);

  totalBox.appendChild(totalLabel);
  totalBox.appendChild(totalAmount);

  resultContainer.appendChild(list);
  resultContainer.appendChild(totalBox);
}

/* Handles form submission: validates inputs, computes total fare, displays result, and saves state */
function handleFareSubmit(event) {
  event.preventDefault();

  if (!validateFareForm()) {
    return;
  }

  const carId = document.getElementById("car-select").value;
  const days = parseInt(document.getElementById("days-input").value.trim(), 10);
  const destinationId = document.getElementById("destination-select").value;

  const vehicle = findVehicleById(carId);
  const destination = findDestinationById(destinationId);

  /* Core fare formula: (car price per day x days) + destination surcharge */
  const totalFare = (vehicle.pricePerDay * days) + destination.surcharge;

  displayFareResult(vehicle, days, destination, totalFare);

  /* Save last calculation to localStorage */
  saveLastCalculationToStorage({
    carId: carId,
    days: days,
    destinationId: destinationId,
    totalFare: totalFare
  });
}

/* ==========================================================================
   6. localStorage Save and Restore (with Error Handling)
   ========================================================================== */

/* Safely saves the selected car ID to localStorage */
function saveSelectedCarToStorage(carId) {
  try {
    localStorage.setItem(STORAGE_KEY_SELECTED_CAR, carId);
  } catch (error) {
    /* Ignore storage errors if localStorage is disabled or full */
  }
}

/* Safely saves the last fare calculation object as JSON in localStorage */
function saveLastCalculationToStorage(calculationData) {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_FARE, JSON.stringify(calculationData));
  } catch (error) {
    /* Ignore storage errors if localStorage is disabled or full */
  }
}

/* Restores saved selected car and last fare calculation from localStorage on page load */
function loadStateFromStorage() {
  /* Restore selected car if valid */
  try {
    const savedCarId = localStorage.getItem(STORAGE_KEY_SELECTED_CAR);
    if (savedCarId && findVehicleById(savedCarId)) {
      selectVehicle(savedCarId);
    }
  } catch (error) {
    /* Ignore corrupted or inaccessible storage */
  }

  /* Restore last calculation if valid */
  try {
    const savedFareRaw = localStorage.getItem(STORAGE_KEY_LAST_FARE);
    if (!savedFareRaw) {
      return;
    }

    const savedFare = JSON.parse(savedFareRaw);

    /* Make sure the saved object exists and all fields are valid */
    if (!savedFare || typeof savedFare !== "object") {
      return;
    }

    const vehicle = findVehicleById(savedFare.carId);
    const destination = findDestinationById(savedFare.destinationId);
    const days = Number(savedFare.days);

    if (vehicle && destination && Number.isInteger(days) && days >= 1 && days <= 30) {
      /* Restore form fields and card highlight */
      selectVehicle(vehicle.id);
      document.getElementById("days-input").value = days;
      document.getElementById("destination-select").value = destination.id;

      /* Recalculate and display breakdown cleanly */
      const totalFare = (vehicle.pricePerDay * days) + destination.surcharge;
      displayFareResult(vehicle, days, destination, totalFare);
    }
  } catch (error) {
    /* Remove corrupted JSON so future loads remain clean */
    try {
      localStorage.removeItem(STORAGE_KEY_LAST_FARE);
    } catch (removeError) {
      /* Ignore cleanup failure */
    }
  }
}

/* ==========================================================================
   7. Page Initialization
   ========================================================================== */

/* Sets up the page once the HTML document has finished loading */
function initializeTransportationPage() {
  renderVehicleCards();
  populateDropdowns();
  loadStateFromStorage();

  const carSelect = document.getElementById("car-select");
  const daysInput = document.getElementById("days-input");
  const destinationSelect = document.getElementById("destination-select");
  const fareForm = document.getElementById("fare-form");

  /* Keep vehicle card highlight in sync when the user changes the Car dropdown */
  carSelect.addEventListener("change", function () {
    if (findVehicleById(carSelect.value)) {
      selectVehicle(carSelect.value);
    } else {
      clearVehicleSelection();
      saveSelectedCarToStorage("");
    }
  });

  /* Clear inline errors when the user updates Days or Destination */
  daysInput.addEventListener("input", function () {
    clearSingleFieldError(daysInput, document.getElementById("days-error"));
  });

  destinationSelect.addEventListener("change", function () {
    clearSingleFieldError(destinationSelect, document.getElementById("destination-error"));
  });

  /* Handle fare calculation on form submit */
  fareForm.addEventListener("submit", handleFareSubmit);
}

/* Run initialization after the DOM is ready */
document.addEventListener("DOMContentLoaded", initializeTransportationPage);
