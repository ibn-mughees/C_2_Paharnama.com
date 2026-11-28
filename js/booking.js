/* ==========================================================================
   PaharNama Booking Page Script
   Handles dropdown options, form validation, 4 prototype states,
   booking summary generation, confirmation modal, and localStorage memory.
   ========================================================================== */

/* ==========================================================================
   1. Data Lists and Storage Keys
   ========================================================================== */

/* List of available destinations for the Destination dropdown */
const destinationOptions = [
  "Skardu",
  "Gilgit",
  "Chitral"
];

/* List of available tour packages for the Tour Package dropdown */
const tourPackageOptions = [
  "Field Trip",
  "Wedding Packages",
  "Birthday Packages",
];

/* List of available vehicles for the Transport dropdown */
const transportOptions = [
  "Toyota Hiace",
  "Land Cruiser",
  "Toyota Corolla"
];

/* Maps vehicle IDs saved by transportation.js to matching Transport dropdown labels */
const transportationCarMap = {
  "toyota-hiace": "Toyota Hiace",
  "land-cruiser": "Land Cruiser",
  "toyota-corolla": "Toyota Corolla"
};

/* List defining every row shown in the Booking Summary */
const summaryRowDefinitions = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "destination", label: "Destination" },
  { key: "tourPackage", label: "Tour Package" },
  { key: "departureDate", label: "Departure Date" },
  { key: "returnDate", label: "Return Date" },
  { key: "numberOfDays", label: "Number of Days" },
  { key: "travellers", label: "Travellers" },
  { key: "transport", label: "Transport" }
];

/* Keys used to read and write data in browser localStorage */
const STORAGE_KEY_BOOKING = "paharnamaBooking";
const STORAGE_KEY_SELECTED_CAR = "paharnama_selected_car";

/* Tracks whether the user has submitted the form at least once */
let hasSubmittedForm = false;

/* Tracks whether the Booking Summary section is currently visible */
let isSummaryVisible = false;

/* ==========================================================================
   2. Dropdown Population
   ========================================================================== */

/* Fills a single select dropdown with a placeholder option and a list of items */
function populateSingleDropdown(selectElement, placeholderText, itemsList) {
  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholderText;
  selectElement.appendChild(defaultOption);

  for (let i = 0; i < itemsList.length; i++) {
    const option = document.createElement("option");
    option.value = itemsList[i];
    option.textContent = itemsList[i];
    selectElement.appendChild(option);
  }
}

/* Populates Destination, Tour Package, and Transport dropdowns from JavaScript lists */
function populateAllDropdowns() {
  populateSingleDropdown(
    document.getElementById("destination"),
    "Select destination",
    destinationOptions
  );
  populateSingleDropdown(
    document.getElementById("tour-package"),
    "Select tour package",
    tourPackageOptions
  );
  populateSingleDropdown(
    document.getElementById("transport"),
    "Select transport",
    transportOptions
  );
}

/* ==========================================================================
   3. Date Helpers
   ========================================================================== */

/* Returns today's local calendar date formatted as YYYY-MM-DD */
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/* Calculates the whole number of days between departure and return dates */
function calculateNumberOfDays(departureDateText, returnDateText) {
  const depParts = departureDateText.split("-");
  const retParts = returnDateText.split("-");

  const depUtc = Date.UTC(Number(depParts[0]), Number(depParts[1]) - 1, Number(depParts[2]));
  const retUtc = Date.UTC(Number(retParts[0]), Number(retParts[1]) - 1, Number(retParts[2]));

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round((retUtc - depUtc) / millisecondsPerDay);
}

/* Formats a YYYY-MM-DD date string into a readable date for the summary */
function formatDisplayDate(dateText) {
  const parts = dateText.split("-");
  if (parts.length !== 3) {
    return dateText;
  }

  const dateObject = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

/* ==========================================================================
   4. Field Validation Rules and Error Display
   ========================================================================== */

/* Shows a red border, red star, and red message for a single invalid field */
function showFieldError(fieldId, starId, errorId, message) {
  const inputElement = document.getElementById(fieldId);
  const starElement = document.getElementById(starId);
  const errorElement = document.getElementById(errorId);

  inputElement.classList.add("is-invalid");
  inputElement.setAttribute("aria-invalid", "true");
  starElement.classList.remove("d-none");
  errorElement.textContent = message;
}

/* Removes the red border, red star, and red message from a single field */
function clearFieldError(fieldId, starId, errorId) {
  const inputElement = document.getElementById(fieldId);
  const starElement = document.getElementById(starId);
  const errorElement = document.getElementById(errorId);

  inputElement.classList.remove("is-invalid");
  inputElement.removeAttribute("aria-invalid");
  starElement.classList.add("d-none");
  errorElement.textContent = "";
}

/* Shows or hides the red Required Details alert box above the form */
function setAlertBoxVisible(shouldShow) {
  const alertBox = document.getElementById("form-error-alert");
  if (shouldShow) {
    alertBox.classList.remove("d-none");
  } else {
    alertBox.classList.add("d-none");
  }
}

/* Checks if any form field currently has an error and hides the alert box when all are clear */
function updateAlertBoxVisibility() {
  const invalidFields = document.querySelectorAll("#booking-form .is-invalid");
  if (invalidFields.length === 0) {
    setAlertBoxVisible(false);
  }
}

/* Validates Full Name: at least 3 letters, letters and spaces only */
function validateFullName() {
  const value = document.getElementById("full-name").value.trim();

  if (value === "") {
    return "Please enter your full name.";
  }

  const lettersAndSpacesOnly = /^[A-Za-z ]+$/.test(value);
  if (!lettersAndSpacesOnly) {
    return "Full name must contain letters and spaces only.";
  }

  const letterCount = value.replace(/ /g, "").length;
  if (letterCount < 3) {
    return "Full name must have at least 3 letters.";
  }

  return "";
}

/* Validates Email: must follow a standard email format */
function validateEmail() {
  const value = document.getElementById("email").value.trim();

  if (value === "") {
    return "Please enter your email address.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(value)) {
    return "Please enter a valid email address (for example, name@example.com).";
  }

  return "";
}

/* Validates Destination: one option from the list must be chosen */
function validateDestination() {
  const value = document.getElementById("destination").value;
  if (destinationOptions.indexOf(value) === -1) {
    return "Please select a destination.";
  }
  return "";
}

/* Validates Tour Package: one option from the list must be chosen */
function validateTourPackage() {
  const value = document.getElementById("tour-package").value;
  if (tourPackageOptions.indexOf(value) === -1) {
    return "Please select a tour package.";
  }
  return "";
}

/* Validates Departure Date: cannot be empty and cannot be in the past */
function validateDepartureDate() {
  const value = document.getElementById("departure-date").value;

  if (value === "") {
    return "Please choose a departure date.";
  }

  if (value < getTodayDateString()) {
    return "Departure date cannot be in the past.";
  }

  return "";
}

/* Validates Return Date: cannot be empty and must be after Departure Date */
function validateReturnDate() {
  const departureValue = document.getElementById("departure-date").value;
  const returnValue = document.getElementById("return-date").value;

  if (returnValue === "") {
    return "Please choose a return date.";
  }

  if (departureValue !== "" && returnValue <= departureValue) {
    return "Return date must be after the departure date.";
  }

  return "";
}

/* Validates Travellers: must be a whole number from 1 to 15 */
function validateTravellers() {
  const rawValue = document.getElementById("travellers").value.trim();

  if (rawValue === "") {
    return "Please enter the number of travellers.";
  }

  if (!/^\d+$/.test(rawValue)) {
    return "Please enter a whole number from 1 to 15.";
  }

  const count = Number(rawValue);
  if (count < 1 || count > 15) {
    return "Number of travellers must be between 1 and 15.";
  }

  return "";
}

/* Validates Transport: one option from the list must be chosen */
function validateTransport() {
  const value = document.getElementById("transport").value;
  if (transportOptions.indexOf(value) === -1) {
    return "Please select a transport option.";
  }
  return "";
}

/* Configuration list connecting each field ID to its validator and error elements */
const fieldConfigs = [
  {
    fieldId: "full-name",
    starId: "full-name-star",
    errorId: "full-name-error",
    validator: validateFullName,
    eventType: "input"
  },
  {
    fieldId: "email",
    starId: "email-star",
    errorId: "email-error",
    validator: validateEmail,
    eventType: "input"
  },
  {
    fieldId: "destination",
    starId: "destination-star",
    errorId: "destination-error",
    validator: validateDestination,
    eventType: "change"
  },
  {
    fieldId: "tour-package",
    starId: "tour-package-star",
    errorId: "tour-package-error",
    validator: validateTourPackage,
    eventType: "change"
  },
  {
    fieldId: "departure-date",
    starId: "departure-date-star",
    errorId: "departure-date-error",
    validator: validateDepartureDate,
    eventType: "change"
  },
  {
    fieldId: "return-date",
    starId: "return-date-star",
    errorId: "return-date-error",
    validator: validateReturnDate,
    eventType: "change"
  },
  {
    fieldId: "travellers",
    starId: "travellers-star",
    errorId: "travellers-error",
    validator: validateTravellers,
    eventType: "input"
  },
  {
    fieldId: "transport",
    starId: "transport-star",
    errorId: "transport-error",
    validator: validateTransport,
    eventType: "change"
  }
];

/* Validates a single field configuration and updates its UI error state */
function validateSingleField(config) {
  const message = config.validator();
  if (message !== "") {
    showFieldError(config.fieldId, config.starId, config.errorId, message);
    return false;
  }

  clearFieldError(config.fieldId, config.starId, config.errorId);
  updateAlertBoxVisibility();
  return true;
}

/* Validates all 8 fields; returns the first invalid input element or null if all pass */
function validateAllFields() {
  let firstInvalidElement = null;

  for (let i = 0; i < fieldConfigs.length; i++) {
    const config = fieldConfigs[i];
    const isFieldValid = validateSingleField(config);
    if (!isFieldValid && !firstInvalidElement) {
      firstInvalidElement = document.getElementById(config.fieldId);
    }
  }

  return firstInvalidElement;
}

/* ==========================================================================
   5. Booking Summary Rendering and Navigation
   ========================================================================== */

/* Collects the current values from all booking form fields */
function getFormData() {
  return {
    fullName: document.getElementById("full-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    destination: document.getElementById("destination").value,
    tourPackage: document.getElementById("tour-package").value,
    departureDate: document.getElementById("departure-date").value,
    returnDate: document.getElementById("return-date").value,
    travellers: document.getElementById("travellers").value.trim(),
    transport: document.getElementById("transport").value
  };
}

/* Builds the Booking Summary rows from summaryRowDefinitions and displays the summary */
function renderBookingSummary(formData) {
  const summaryList = document.getElementById("summary-rows-list");
  summaryList.innerHTML = "";

  const totalDays = calculateNumberOfDays(formData.departureDate, formData.returnDate);
  let dayLabel = "days";
  if (totalDays === 1) {
    dayLabel = "day";
  }

  const travellerCount = Number(formData.travellers);
  let travellerLabel = "travellers";
  if (travellerCount === 1) {
    travellerLabel = "traveller";
  }

  const summaryValues = {
    fullName: formData.fullName,
    email: formData.email,
    destination: formData.destination,
    tourPackage: formData.tourPackage,
    departureDate: formatDisplayDate(formData.departureDate),
    returnDate: formatDisplayDate(formData.returnDate),
    numberOfDays: totalDays + " " + dayLabel,
    travellers: travellerCount + " " + travellerLabel,
    transport: formData.transport
  };

  for (let i = 0; i < summaryRowDefinitions.length; i++) {
    const rowDef = summaryRowDefinitions[i];

    const listItem = document.createElement("li");
    listItem.className = "summary-row";

    const labelSpan = document.createElement("span");
    labelSpan.className = "summary-label";
    labelSpan.textContent = rowDef.label;

    const valueSpan = document.createElement("span");
    valueSpan.className = "summary-value";
    valueSpan.textContent = summaryValues[rowDef.key];

    listItem.appendChild(labelSpan);
    listItem.appendChild(valueSpan);
    summaryList.appendChild(listItem);
  }

  document.getElementById("booking-summary-section").classList.remove("d-none");
  isSummaryVisible = true;
}

/* Hides the Booking Summary section */
function hideBookingSummary() {
  document.getElementById("booking-summary-section").classList.add("d-none");
  isSummaryVisible = false;
}

/* ==========================================================================
   6. localStorage Save and Restore (with try/catch)
   ========================================================================== */

/* Safely saves the current booking form values and summary visibility to localStorage */
function saveBookingToStorage() {
  const dataToSave = getFormData();
  dataToSave.summaryVisible = isSummaryVisible;

  try {
    localStorage.setItem(STORAGE_KEY_BOOKING, JSON.stringify(dataToSave));
  } catch (error) {
    /* Ignore storage errors if localStorage is unavailable or full */
  }
}

/* Reads the car selected on the Transportation page and converts it to a dropdown label */
function getSavedTransportationCar() {
  try {
    const savedCar = localStorage.getItem(STORAGE_KEY_SELECTED_CAR);
    if (!savedCar) {
      return "";
    }

    if (transportationCarMap[savedCar]) {
      return transportationCarMap[savedCar];
    }

    if (transportOptions.indexOf(savedCar) !== -1) {
      return savedCar;
    }
  } catch (error) {
    /* Ignore storage access errors */
  }

  return "";
}

/* Restores saved booking data from localStorage or pre-fills the car from Transportation */
function loadSavedBookingState() {
  let parsedData = null;

  try {
    const rawSavedData = localStorage.getItem(STORAGE_KEY_BOOKING);
    if (rawSavedData) {
      parsedData = JSON.parse(rawSavedData);
    }
  } catch (error) {
    /* Keep the page working cleanly if stored JSON is damaged */
    parsedData = null;
  }

  if (parsedData && typeof parsedData === "object") {
    if (typeof parsedData.fullName === "string") {
      document.getElementById("full-name").value = parsedData.fullName;
    }
    if (typeof parsedData.email === "string") {
      document.getElementById("email").value = parsedData.email;
    }
    if (typeof parsedData.destination === "string" && destinationOptions.indexOf(parsedData.destination) !== -1) {
      document.getElementById("destination").value = parsedData.destination;
    }
    if (typeof parsedData.tourPackage === "string" && tourPackageOptions.indexOf(parsedData.tourPackage) !== -1) {
      document.getElementById("tour-package").value = parsedData.tourPackage;
    }
    if (typeof parsedData.departureDate === "string") {
      document.getElementById("departure-date").value = parsedData.departureDate;
    }
    if (typeof parsedData.returnDate === "string") {
      document.getElementById("return-date").value = parsedData.returnDate;
    }
    if (typeof parsedData.travellers === "string" || typeof parsedData.travellers === "number") {
      document.getElementById("travellers").value = String(parsedData.travellers);
    }
    if (typeof parsedData.transport === "string" && transportOptions.indexOf(parsedData.transport) !== -1) {
      document.getElementById("transport").value = parsedData.transport;
    }
  }

  /* If Booking has no saved transport, pre-select the car saved from Transportation */
  const transportSelect = document.getElementById("transport");
  if (transportSelect.value === "") {
    const preselectedCar = getSavedTransportationCar();
    if (preselectedCar !== "") {
      transportSelect.value = preselectedCar;
    }
  }

  /* Restore the Booking Summary if it was open and all restored fields are valid */
  if (parsedData && parsedData.summaryVisible === true) {
    const firstInvalid = validateAllFields();
    if (!firstInvalid) {
      renderBookingSummary(getFormData());
    } else {
      /* Avoid showing error banners automatically on initial reload */
      for (let i = 0; i < fieldConfigs.length; i++) {
        clearFieldError(fieldConfigs[i].fieldId, fieldConfigs[i].starId, fieldConfigs[i].errorId);
      }
      setAlertBoxVisible(false);
      hideBookingSummary();
    }
  }
}

/* ==========================================================================
   7. Event Handlers
   ========================================================================== */

/* Handles clicking "Continue to Booking Summary" */
function handleBookingSubmit(event) {
  event.preventDefault();
  hasSubmittedForm = true;

  const firstInvalidElement = validateAllFields();

  if (firstInvalidElement) {
    hideBookingSummary();
    setAlertBoxVisible(true);
    saveBookingToStorage();
    firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
    firstInvalidElement.focus({ preventScroll: true });
    return;
  }

  setAlertBoxVisible(false);
  const formData = getFormData();
  renderBookingSummary(formData);
  saveBookingToStorage();

  document.getElementById("booking-summary-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Handles clicking "Edit Details" to hide the summary and scroll back to the form */
function handleEditDetails() {
  hideBookingSummary();
  saveBookingToStorage();

  document.getElementById("booking-form-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Handles clicking "Confirm Booking" to open the confirmation modal */
function handleConfirmBooking() {
  const modalElement = document.getElementById("booking-confirm-modal");
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
}

/* Attaches live validation and storage listeners to every form field */
function attachFieldListeners() {
  for (let i = 0; i < fieldConfigs.length; i++) {
    const config = fieldConfigs[i];
    const inputElement = document.getElementById(config.fieldId);

    /* Re-check the field when the user leaves it */
    inputElement.addEventListener("blur", function () {
      if (hasSubmittedForm || inputElement.classList.contains("is-invalid") || inputElement.value.trim() !== "") {
        validateSingleField(config);
      }
      saveBookingToStorage();
    });

    /* Re-check the field as soon as the user changes or types in it */
    inputElement.addEventListener(config.eventType, function () {
      if (hasSubmittedForm || inputElement.classList.contains("is-invalid")) {
        validateSingleField(config);
      }

      /* Keep Return Date error state in sync whenever Departure Date changes */
      if (config.fieldId === "departure-date") {
        const returnInput = document.getElementById("return-date");
        if (hasSubmittedForm || returnInput.classList.contains("is-invalid") || returnInput.value !== "") {
          validateSingleField(fieldConfigs[5]);
        }
      }

      saveBookingToStorage();
    });
  }
}

/* ==========================================================================
   8. Page Initialization
   ========================================================================== */

/* Sets up dropdowns, saved state, and event listeners once the DOM is ready */
function initializeBookingPage() {
  populateAllDropdowns();
  loadSavedBookingState();
  attachFieldListeners();

  document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);
  document.getElementById("edit-details-btn").addEventListener("click", handleEditDetails);
  document.getElementById("confirm-booking-btn").addEventListener("click", handleConfirmBooking);
}

/* Run initialization after the HTML document has finished loading */
document.addEventListener("DOMContentLoaded", initializeBookingPage);
