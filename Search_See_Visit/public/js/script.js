"use strick";

let city = "";
let current_map;

// Menu Open and Close
class Menu {
  constructor() {
    const menuBtn = document.getElementById("open-menu");
    const menuCloseBtn = document.getElementById("nav-close");
    const nav = document.querySelector(".navigation-items");
    const nav_links = document.querySelectorAll(".nav-link");
    this.MenuEvent(menuBtn, menuCloseBtn, nav, nav_links);
  }

  MenuEvent(Mbtn, MCbtn, nav, links) {
    // Mobile Nav Open
    Mbtn.addEventListener("click", function () {
      nav.classList.add("nav-open");
    });

    // Mobile Nav Close
    MCbtn.addEventListener("click", function () {
      nav.classList.remove("nav-open");
    });

    // Mobile Nav Close When Links have clicked
    links.forEach((i) => {
      i.addEventListener("click", function () {
        nav.classList.remove("nav-open");
      });
    });

    // Mobile Nav Close When other items have clicked
    document.addEventListener("click", function (e) {
      if (!e.composedPath().includes(nav) && !e.composedPath().includes(Mbtn)) {
        nav.classList.remove("nav-open");
      }
    });
  }
}

const menu = new Menu();

class SearchButton {
  constructor() {
    const search_button = document.querySelector(".ara-btn");
    if (search_button) this.SearchButtonClicked(search_button);
  }

  // Search button clicked and saving_city object was created
  SearchButtonClicked(s_button) {
    s_button.addEventListener("click", function () {
      const saving_city = new EnteredCity();
    });
  }
}

class Map {
  #map;
  constructor() {
    let current_location;
    // Checking users current location
    if (navigator.geolocation) {
      current_location = navigator.geolocation;
    } else {
      alert("Could not get your position");
    }
    this.MapOnScreen(current_location);
  }

  // Getting user's current location coordinates
  GetCurrentPosition(curr_location) {
    let current_coords = [];
    return new Promise((resolve) => {
      curr_location.getCurrentPosition(
        function (position) {
          const { latitude } = position.coords;
          const { longitude } = position.coords;
          current_coords = [latitude, longitude];
          resolve(current_coords);
        },
        function () {
          alert("Could not get your position");
        }
      );
    });
  }

  // Setting private map variable to screenmap variable
  #setMap(coords) {
    this.#map = L.map("harita").setView(coords, 7);
    current_map = this.#map;
  }

  //Showing map on the screen
  async MapOnScreen(current_location) {
    const coords = await this.GetCurrentPosition(current_location);
    this.#setMap(coords);

    L.tileLayer(`https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreet.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //PopUp current city on the map
    const current_city_api = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords[0]}&longitude=${coords[1]}&localityLanguage=en`;
    fetch(current_city_api)
      .then((res) => res.json())
      .then((data) => {
        this.PopUpOnMap(
          coords,
          `Now you are here, in ${data.principalSubdivision} `,
          this.#map
        );
        this.CityButton(data.principalSubdivision);
      });

    this.MapClicked();
  }

  //PopUp function was declerated
  PopUpOnMap(coords, name, map) {
    L.marker(coords).addTo(map).bindPopup(name).openPopup();
  }

  // Users can choose city on the map
  MapClicked() {
    let clicked_coords = [];

    this.#map.on(
      "click",
      async function (mapEvent) {
        if (mapEvent.latlng) {
          const { lat, lng } = mapEvent.latlng;
          clicked_coords = [lat, lng];

          const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

          fetch(geoApiUrl)
            .then((res) => res.json())
            .then((data) => {
              if (
                data.countryName === "Turkiye" ||
                data.countryName === "Turkey"
              ) {
                // PopUp clicked_city
                this.PopUpOnMap(
                  clicked_coords,
                  data.principalSubdivision,
                  this.#map
                );
                // Set city_btn clicked_city
                this.CityButton(data.principalSubdivision);
              } else {
                alert(
                  "This city is not location on Turkey. Please enter city which is location on Turkey."
                );
              }
            });
        }
      }.bind(this)
    );
  }

  // Setting city_button to current city or clicked city or seacrced city
  CityButton(city_name) {
    const city_btn_div = document.querySelector(".city_button");
    city_btn_div.innerHTML = `<button class="btn btn-primary btn-city">Go to ${city_name} &rarr;</button>`;
    const choosing_city = new GoToCity();
    choosing_city.GoToChoosingCity(city_name);
  }
}

class CheckCityTurkey extends Map {
  getCity(city) {
    this.#CheckCity(city);
  }

  #CheckCity(city) {
    // controlling if the city is located Turkey or not
    if (city) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          if (
            data[0].display_name.includes("Turkey") ||
            data[0].display_name.includes("Türkiye")
          ) {
            const city_coords = [data[0].lat, data[0].lon];
            super.CityButton(city);
            super.PopUpOnMap(city_coords, city, current_map);
          } else {
            alert(
              "This city is not location on Turkey. Please enter city which is location on Turkey."
            );
          }
        });
    }
  }
}

class EnteredCity extends CheckCityTurkey {
  constructor() {
    super();
    const input_city = document.querySelector(".search-bar");
    this.SavingInputCity(input_city);
  }

  SavingInputCity(input_city) {
    //Saving input city
    let check_city;
    check_city =
      input_city.value.charAt(0).toUpperCase() + input_city.value.slice(1);

    check_city && this.#ValidateCity(check_city);
  }

  #ValidateCity(check_city) {
    //Define bad characters array
    let bad_characters = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      0,
      '"',
      ",",
      ".",
      "/",
      "<",
      ">",
      "?",
      "|",
      "}",
      "{",
      "]",
      "[",
      "~",
      "`",
      "!",
      "@",
      " ",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "-",
      "=",
      "+",
      "...",
    ];

    // Checking input city includes bad characters or not
    if (bad_characters.some((bc) => check_city.includes(bc))) {
      alert("Wrong city name!. Please enter valid city name.");
    } else {
      //Now checking some city names that have problem
      if (check_city === "Mus") {
        city = "Muş";
        super.getCity(city);
      } else if (check_city === "Mugla") {
        city = "Muğla";
        super.getCity(city);
      } else if (check_city === "Igdir" || check_city === "İgdir") {
        city = "Iğdır";
        super.getCity(city);
      } else {
        // Checking city in Turkey or not
        city = check_city;
        super.getCity(city);
      }
    }
  }
}

class GoToCity {
  GoToChoosingCity(city) {
    const city_button = document.querySelector(".btn-city");
    city_button.addEventListener("click", function () {
      localStorage.setItem("selectedCity", city);
      window.location.href = "cities.html";
    });
  }
}

const btn_search = new SearchButton();
const map = new Map();
