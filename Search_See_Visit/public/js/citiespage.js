"use strick";

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

// Getting selected city from search page
class GetandCheckCity {
  getCityFromSearchPage() {
    // getting city from local storage
    const selectedCity = localStorage.getItem("selectedCity");
    this.#CheckCityTurkey(selectedCity);
  }

  #CheckCityTurkey(city) {
    if (city) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          if (
            data[0].display_name.includes("Turkey") ||
            data[0].display_name.includes("Türkiye")
          ) {
            // if city is located on Turkey then make new database connect
            const chanage_title = new Title();
            chanage_title.ChangeTitleName(city);
            const db_connection = new DataBaseConnection();
            db_connection.SearchedCity(city);
          } else {
            // if city is not located on Turkey then make alert and go to the back(search page)
            alert(
              "This city is not location on Turkey. Please enter city which is location on Turkey."
            );
            window.location.href = "../index.html";
          }
        });
    }
  }
}

const getting_city = new GetandCheckCity();
getting_city.getCityFromSearchPage();

// Change site title name
class Title {
  ChangeTitleName(selected_city) {
    const title = document.querySelector("title");
    title.innerHTML = `${selected_city}`;
  }
}

// connectioning data base
class DataBaseConnection {
  SearchedCity(city) {
    this.#getCityInformation(city);
  }

  #getCityInformation(searched_city) {
    // sending request to te server for city information
    fetch(`/getDataCity?city=${searched_city}`)
      .then((response) => response.json())
      .then((data) => {
        const city_info = new ParseData();
        city_info.getCityData(data);
      })
      // Handling error message
      .catch((error) =>
        alert(
          `${error} :Sunucu tarafında beklenmedik bir hata olustu. Arama sayfasına geri dönüp yeniden arama yapmanızı rica ederiz.`
        )
      );
  }
}

// getting city info from database and parsing it
class ParseData {
  getCityData(data) {
    // if city data exsists
    if (data) {
      // Parse data to 3 array ==Places Names==Informations==Images
      const places_names = [...new Set(data.map((item) => item.PlaceName))];
      const places_info = [...new Set(data.map((item) => item.PlaceInfo))];
      const places_image = [...new Set(data.map((item) => item.PlaceImage))];
      const places_otel_info = data.map((item) => item.OtelInfo)[0];
      const places_tour_info = data.map((item) => item.TourInfo)[0];

      const meal_name = [...new Set(data.map((item) => item.MealName))];
      const meal_info = [...new Set(data.map((item) => item.MealInfo))];
      const meal_photo = [...new Set(data.map((item) => item.MealPhoto))];
      const meal_restaurant = data.map((item) => item.RestaurantInfo)[0];

      // sende parsed data to the carousel for preparing carousel elements
      const create_carouse_element = new CreateCarousel();
      create_carouse_element.CreateTravelCarouselElements(
        places_names,
        places_info,
        places_image,
        meal_name,
        meal_info,
        meal_photo,
        places_tour_info,
        places_otel_info,
        meal_restaurant
      );
    }
  }
}

// creating carousel elements
class CreateCarousel {
  CreateTravelCarouselElements(
    p_names,
    p_infos,
    p_imgs,
    m_names,
    m_infos,
    m_imgs,
    tour,
    otel,
    restaurant
  ) {
    // Getting images and places names
    const images_container = document.querySelector(
      "section.travels .slide-item"
    );

    const meals_images_container = document.querySelector(
      "section.meals .slide-item"
    );

    const travel_slider_title = document.querySelector(
      "section.travels .slider-title "
    );

    const meal_slider_title = document.querySelector(
      "section.meals .slider-title "
    );

    const travel_infos = document.querySelector("section.travels .info");
    const meal_infos = document.querySelector("section.meals .info-meal");

    const tour_pragraph = document.querySelector("section.travels .info-tour");
    const otel_pragraph = document.querySelector("section.travels .info-otel");
    const restaurant_pragraph = document.querySelector(
      "section.meals .info-restaurant"
    );

    // Adding places name to the html
    p_names.map((item) => {
      travel_slider_title.innerHTML += `<h2>${item}</h2>`;
    });

    m_names.map((item) => {
      meal_slider_title.innerHTML += `<h2>${item}</h2>`;
    });

    // Adding places images to the html
    p_imgs.map((item) => {
      let document_name = item.charAt(0).toUpperCase() + item.slice(1);
      images_container.insertAdjacentHTML(
        "beforeend",
        `<img src="./img/Cities/Places/${document_name}/${item}.webp" alt="${item}" />`
      );
    });

    m_imgs.map((item) => {
      let document_name = item.charAt(0).toUpperCase() + item.slice(1);
      meals_images_container.insertAdjacentHTML(
        "beforeend",
        `<img src="./img/Cities/Meals/${document_name}/${item}.webp" alt="${item}" />`
      );
    });

    // Adding places information to the html
    p_infos.map((info) => {
      travel_infos.innerHTML += `<p class='fade'>${info}</p>`;
    });

    m_infos.map((info) => {
      meal_infos.innerHTML += `<p class='fade'>${info}</p>`;
    });

    const description_headers = document.querySelectorAll(
      "section.travels .description-head h4"
    );

    const meals_description_headers = document.querySelectorAll(
      "section.meals .description-head h4"
    );

    const description_parag = document.querySelectorAll(
      "section.travels .description-paragraph"
    );

    const meals_description_parag = document.querySelectorAll(
      "section.meals .description-paragraph"
    );

    // changing active description header
    description_headers.forEach((head, index) => {
      head.addEventListener("click", function () {
        description_headers.forEach((item) => {
          item.classList.remove("active");
        });

        // changine aktiv descriptions
        description_parag.forEach((p) => {
          p.classList.add("invisible");
        });

        description_headers[index].classList.add("active");
        description_parag[index].classList.remove("invisible");
      });
    });

    // meals description changing
    meals_description_headers.forEach((head, index) => {
      head.addEventListener("click", function () {
        meals_description_headers.forEach((item) => {
          item.classList.remove("active");
        });

        // changine aktiv descriptions
        meals_description_parag.forEach((p) => {
          p.classList.add("invisible");
        });

        meals_description_headers[index].classList.add("active");
        meals_description_parag[index].classList.remove("invisible");
      });
    });

    // Adding tour and otel information to the html
    if (tour && otel) {
      // if we have otel and tour information then:

      tour_pragraph.innerHTML = `<p class="active info-tour fade">${tour}</p>`;
      otel_pragraph.innerHTML = `<p class="active info-otels fade">${otel}</p>`;
    }

    // Adding restaurant information to the html
    if (restaurant) {
      restaurant_pragraph.innerHTML = `<p class="active info-tour fade">${restaurant}</p>`;
    }

    const carousel_event = new CarouselEvent();
  }
}

// Scrolling carousel images, changes places names and places informations
class CarouselEvent {
  constructor() {
    // getting side buttons, places and meals images and names of them
    const scroll_right_btns = document.querySelectorAll(".right-side-btn");
    const scroll_left_btns = document.querySelectorAll(".left-side-btn");
    const travel_slide_imgs = document.querySelectorAll(
      "section.travels .slide-item img"
    );
    const meal_slide_imgs = document.querySelectorAll(
      "section.meals .slide-item img"
    );
    const places_names = document.querySelectorAll(
      "section.travels .slider-title h2"
    );

    const meals_names = document.querySelectorAll(
      "section.meals .slider-title h2"
    );

    const infos = document.querySelectorAll("section.travels .info p");
    const m_infos = document.querySelectorAll("section.meals .info-meal p");

    // First slide name appeared
    places_names[0].classList.add("active");
    meals_names[0].classList.add("active");

    // First slide info appeared
    infos[0].classList.add("active");
    m_infos[0].classList.add("active");

    this.CarouselEvent(
      scroll_right_btns,
      scroll_left_btns,
      travel_slide_imgs,
      places_names,
      infos,
      meal_slide_imgs,
      meals_names,
      m_infos
    );
  }

  CarouselEvent(
    right_btns,
    left_btns,
    travel_slides,
    places_names,
    places_infos,
    meal_slides,
    meals_names,
    m_infos
  ) {
    let moveAmount = 103;
    let count_for_travel = 0;
    let count_for_meals = 0;
    right_btns[0].addEventListener("click", function () {
      //   count variable must be less than length of travel_slides - 1
      if (count_for_travel === travel_slides.length - 1) {
        count_for_travel = 0;
      } else count_for_travel++;

      //   scrooll slider travel location images from left to right
      travel_slides.forEach((slide, index) => {
        slide.style.transform = `translate(${
          moveAmount * (index - count_for_travel)
        }%)`;
      });

      // changing place name
      places_names.forEach((item_name) => {
        item_name.classList.remove("active");
      });

      places_names[count_for_travel].classList.add("active");

      // changing places information
      places_infos.forEach((info) => {
        info.classList.remove("active");
      });

      places_infos[count_for_travel].classList.add("active");
    });

    left_btns[0].addEventListener("click", function () {
      if (count_for_travel === 0) {
        count_for_travel = travel_slides.length - 1;
      } else {
        count_for_travel--;
      }

      //   scrooll slider travel location images from right to left
      travel_slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${
          moveAmount * (index - count_for_travel)
        }%)`;
      });

      // changing places names
      places_names.forEach((item_name) => {
        item_name.classList.remove("active");
      });

      places_names[count_for_travel].classList.add("active");

      // changing places information
      places_infos.forEach((info) => {
        info.classList.remove("active");
      });

      places_infos[count_for_travel].classList.add("active");
    });

    // meals slides
    right_btns[1].addEventListener("click", function () {
      //   count variable must be less than length of travel_slides - 1
      if (count_for_meals === meal_slides.length - 1) {
        count_for_meals = 0;
      } else count_for_meals++;

      //   scrooll slider meal images from left to right
      meal_slides.forEach((slide, index) => {
        slide.style.transform = `translate(${
          moveAmount * (index - count_for_meals)
        }%)`;
      });

      // meals names changing
      meals_names.forEach((item_name) => {
        item_name.classList.remove("active");
      });

      meals_names[count_for_meals].classList.add("active");

      // changing places information
      m_infos.forEach((info) => {
        info.classList.remove("active");
      });

      m_infos[count_for_meals].classList.add("active");
    });

    left_btns[1].addEventListener("click", function () {
      if (count_for_meals === 0) {
        count_for_meals = meal_slides.length - 1;
      } else {
        count_for_meals--;
      }

      //   scrooll slider meal images from right to left
      meal_slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${
          moveAmount * (index - count_for_meals)
        }%)`;
      });

      meals_names.forEach((item_name) => {
        item_name.classList.remove("active");
      });

      meals_names[count_for_meals].classList.add("active");

      // changing places information
      m_infos.forEach((info) => {
        info.classList.remove("active");
      });

      m_infos[count_for_meals].classList.add("active");
    });

    const ready_body = new BodyReady();
    ready_body.HideAnimation();
  }
}

class BodyReady {
  HideAnimation() {
    const body = document.querySelector("body");
    body.style.overflow = "auto";

    const load_animation = document.querySelector(".loading-animation");
    load_animation.classList.add("close");
  }
}
