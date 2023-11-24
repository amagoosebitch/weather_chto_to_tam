class WeatherWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.container.innerHTML = this.createWidget();
    this.weatherData = {};
    this.map = null;
    this.setupEventListener();
  }

  createWidget() {
    return `
    <div class='container-widget'>
      <form id="geoInfo">
        <div>
          <label>широта</label>
          <input type="text" id="latitude" name="latitude" required />
        </div>
        <div>
          <label>долгота</label>
          <input type="text" id="longitude" name="longitude" required />
        </div>
        <button type="submit" class="wheather_show" id="showData">
          показать погоду
        </button>
      </form>
        <div class="wheather_info_description">
          <p id="temperature"></p>
          <p id="title_wheather"></p>
          <img id="wheather_icon" />
        </div>
        <div id="map" style="width: 400px; height: 300px; margin: 20px;"></div>
      </div>
    `;
  }

  setupEventListener() {
    const form = this.container.querySelector("#geoInfo");
    form.addEventListener("submit", (event) => this.handleFormSubmit(event));
  }


  handleFormSubmit(event) {
    event.preventDefault();
    const latitude = this.container.querySelector("#latitude").value;
    const longitude = this.container.querySelector("#longitude").value;
    const latitude_regex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    const longitude_regex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    if (latitude_regex.test(latitude) && longitude_regex.test(longitude)) {
      this.getDataWheather(latitude, longitude);
    } else {
      alert(
        "Неправильно! Попробуй еще раз! Вот тебе подсказка: 48.47, 44.46"
      );
    }
  }

  update() {
    this.container.querySelector("#temperature").textContent = this.weather.current.temp_c;
    this.container.querySelector("#title_wheather").textContent = this.weather.current.condition.text;
    this.container.querySelector("#wheather_icon").style.display = "block";
    this.container.querySelector("#wheather_icon").src = this.weather.current.condition.icon;
  }

  init_map(latitude, longitude) {
    if (!this.map) {
      this.map = new ymaps.Map("map", {
        center: [latitude, longitude],
        zoom: 5,
      });
    }
    this.map.setCenter([latitude, longitude]);
  }

  async getDataWheather(
    latitude,
    longitude,
  ) {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=805f5b47966a4fc18f4133426232411&q=${latitude},${longitude}&lang=ru`);
      this.weather = await response.json();;
      this.update();
      this.init_map(latitude, longitude);
    } catch (error) {
      console.error("Error", error.toString());
    }
  }
}

const widgets = [new WeatherWidget("weather1")];
const addWidget = document.getElementById("add");
addWidget.addEventListener("click", addWidgetFunc);

function addWidgetFunc() {
  const widgetsLen = widgets.length
  const element = document.getElementById(`weather${widgetsLen}`);
  const clone = element.cloneNode(true);
  const newId = `weather${widgetsLen + 1}`;
  clone.id = newId;
  element.parentNode.insertBefore(clone, element);
  widgets.push(new WeatherWidget(newId));
}