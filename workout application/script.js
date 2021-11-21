'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const date= new Date();
const options={
month:"long"
}
const month=new Intl.DateTimeFormat("en-us",options).format(date);
// console.log(month);
const tdate=date.getDate();


let map, mapEvent;

//classes
class Workout {
  date = new Date();

  id = (Date.now() + ' ').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  type='running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = +(this.duration / this.distance);
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
  }
  calcSpeed() {
    this.speed = +(this.distance / (this.duration / 60));
    return this.pace;
  }
}

// const run1= new Running([40,12], 10,50,5);
// const cycle1 = new Cycling([40, 12], 15, 150, 15);
// console.log(run1, cycle1);

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this.changeWorkout.bind(this));

    inputType.addEventListener('change', this.toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('could not get the location');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling lcick onmap
    this.#map.on('click', this.showForm.bind(this));

    console.log(this);
  }
  showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');

  }
  toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputDistance.closest('.form__row').classList.toggle('form__row--hidden');
  }
  changeWorkout(e) {
    // data validation
    // 1. check input is number and positive
    const distance = +inputDistance.value;
    const cadence = +inputCadence.value;
    const duration = +inputDuration.value;
    const elevation = +inputElevation.value;
    const type = inputType.value;
    let workout;
    const { lat, lng } = this.#mapEvent.latlng;
    e.preventDefault();

    // 2. check type of workout
    // if work running create running object
    if (type === 'running') {
      //check datat is valid
      if (
        !isFinite(distance) ||
        !isFinite(duration) ||
        !isFinite(cadence) ||
        distance < 0 ||
        duration < 0 ||
        cadence < 0
      )
        return alert('Please put correct data');
      workout = new Running([lat, lng], distance, duration, cadence);
      //  console.log(Workout);
    }

    // 3. running in cadence.
    // if work running create cycling object

    if (type === 'cycling') {
      if (
        !isFinite(distance) ||
        !isFinite(duration) ||
        !isFinite(elevation) ||
        distance < 0 ||
        duration < 0 ||
        elevation < 0
      )
        return alert('Please put correct data');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add new workout to workouts array
    this.#workouts.push(workout);
    console.log(workout);

    //render workout on map as marker
    this.renderworkoutMarker(workout);

    //  hide form and clear input fielsa
    this.hideForm();

    //render workout on list
    this.renderWorkoutOnList(workout)

  }
  renderworkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup` ,
        })
      )
      .setPopupContent('workout')
      .openPopup();
  }


renderWorkoutOnList(workout){
  let html = `
   <li class="workout workout--${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">Running on ${tdate }th ${month}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type==='running'? '🏃‍♂️':'🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
  `;

 if (workout.type === 'running')
   html += ` 
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

  if(workout.type="cycling"){
    html += `
    <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> 
    `;
  }

  form.insertAdjacentHTML("afterend",html);
}



}
const app = new App();
