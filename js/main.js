var mainWrapper = document.querySelector(".main__wrapper");
var resultsWrapper = document.querySelector(".results__wrapper");
var resultsPanel = document.querySelector(".results__panel");

var introOptions = {
  results: {
    title: "Result",
    text:
      "Look at the result below to see the details of the person you’re searched for.",
  },
  noresults: {
    title: "No Results",
    text: "Please try your search again with a different email address",
  },
};

function introPopulate(option) {
  var introTemplate = `<h2 class="title intro__title">${option.title}</h2>
  <p class="intro__text">${option.text}</p>`;

  var introWrapper = document.querySelector(".results__wrapper .intro");
  introWrapper.innerHTML = introTemplate;
}

function arrayHandler(arr) {
  const iteratorContainer =
    arr &&
    arr
      .map(
        (item) => `
      <p class="column__text">${item}</p>
      `
      )
      .join("");
  return iteratorContainer;
}

function stringToPhone(str) {
  var cleaned = ("" + str).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

var numbersFormatter = (arr) => arr && arr.map((i) => stringToPhone(i));

function dataPopulate(data) {
  var template = `<div class="column results__content">
    <div class="results__heading">
        <h2 id="name_and_age" class="results__title">${data.first_name} ${
    data.last_name
  }</h2>
        <p id="description" class="results__description column__text">${
          data.description
        }</p>
    </div>
    <div class="columns">
        <div id="column__upLeft" class="column__block">
            <div class="column__content">
                <h3 class="column__heading">Address</h3>
                <p id="address" class="column__text">${data.address}</p>
            </div>
        </div>
        <div id="column__downLeft" class="column__block">
            <div class="column__content">
                <h3 class="column__heading">Email</h3>
                <p id="email" class="column__text">${data.email}</p>
            </div>
        </div>
        <div id="column__upRight" class="column__block">
            <div class="column__content phone-number">
                <h3 class="column__heading">Phone Numbers</h3>
                ${arrayHandler(numbersFormatter(data.phone_numbers))}
            </div>
        </div>
        <div id="column__downRight" class="column__block">
            <div class="column__content">
                <h3 class="column__heading">Relatives</h3>
                ${arrayHandler(data.relatives)}
            </div>
        </div>
    </div>
  `;
  var resultsWrapper = document.querySelector("#fetchedData");
  resultsWrapper.innerHTML = template;
}

function formModule() {
  var formWrapper = document.querySelector(".wrapper--active .search__input");
  var formInput = document.querySelector(
    ".wrapper--active .search__input input"
  );
  var formLabel = document.querySelector(
    ".wrapper--active .search__input label"
  );
  var formButton = document.querySelector(
    ".wrapper--active .search__form button"
  );
  var emailForm = document.querySelector(".wrapper--active .search__form form");

  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formInput.addEventListener("focus", function () {
    formWrapper.classList.add("search__input--active");
  });

  formInput.addEventListener("focusout", function () {
    formWrapper.classList.remove("search__input--active");
    if (formInput.value.length !== 0) {
      formWrapper.classList.add("search__input--invalid");
      formLabel.innerHTML = "Please add a valid email address";
      formButton.setAttribute("disabled", "");
      if (emailIsValid(formInput.value)) {
        formWrapper.classList.remove("search__input--invalid");
        formLabel.innerHTML = "EMAIL";
        formButton.removeAttribute("disabled");
      }
    }
  });

  function handleInput() {
    if (emailIsValid(formInput.value)) {
      formWrapper.classList.remove("search__input--invalid");
      formLabel.innerHTML = "EMAIL";
      formButton.removeAttribute("disabled");
    } else {
      formWrapper.classList.add("search__input--invalid");
      formLabel.innerHTML = "Please add a valid email address";
      formButton.setAttribute("disabled", "");
    }
  }

  formInput.addEventListener("keydown", handleInput);
  formInput.addEventListener("paste", handleInput);
  formInput.addEventListener("keyup", handleInput);

  formButton.addEventListener("click", async function () {
    var url = new URL(
      "https://cors-proxy.htmldriven.com/?url=https://ltv-data-api.herokuapp.com/api/v1/records.json"
    );
    url.search = new URLSearchParams({
      email: formInput.value,
    });
    var response = await fetch(url);
    var result = await response.json();
    mainWrapper.classList.remove("wrapper--active");
    mainWrapper.classList.add("wrapper--inactive");
    resultsWrapper.classList.remove("wrapper--inactive");
    resultsWrapper.classList.add("wrapper--active");
    if (result.length !== 0) {
      introPopulate(introOptions.results);
      dataPopulate(result);
      resultsPanel.style.display = "grid";
    } else {
      introPopulate(introOptions.noresults);
      resultsPanel.style.display = "none";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    formInput.value = "";
  });

  return {
    getInputValue: function () {
      return formInput;
    },
    getForm: function () {
      return emailForm;
    },
    getFormButton: function () {
      return formButton;
    },
  };
}

formModule();

var observer = new MutationObserver(callback);

function callback() {
  formModule();
}

observer.observe(mainWrapper, { attributes: true });
