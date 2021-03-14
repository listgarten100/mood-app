//------------initial data
const slides = document.querySelectorAll('.slider-slide');
const btnPauseFirst = document.querySelector('.audio-toggle--first');
const btnPauseSecond = document.querySelector('.audio-toggle--second');
const btnPauseThird = document.querySelector('.audio-toggle--third');
const audioContainer = document.querySelectorAll('.audio');
const audioNames = document.querySelectorAll('.audio-inner');
const audiosVolume = document.querySelectorAll('.audio-volume');
const audios = document.querySelectorAll('.audio-sound');
const audiosFirst = Array.from(document.querySelectorAll('.audio-sound--first'));
const audiosSecond = Array.from(document.querySelectorAll('.audio-sound--second'));
const audiosThird = Array.from(document.querySelectorAll('.audio-sound--third'));
const btnPrev = document.querySelector('.slider-btn--prev');
const btnNext = document.querySelector('.slider-btn--next');
const weatherInfo = document.querySelector('.weather-info');
const weatherInner = document.createElement('div');
const form = document.forms['form'];
const input = form.elements['location'];
const sliderWrapper = document.querySelector('.slider-wrapper');
const screenBtn = document.querySelector('.fullscreen');

let isPlayFirstSound = false;
let isPlaySecondSound = false;
let isPlayThirdSound = false;
let pageXstart = null;
let pageXend = null;
let isFullScreen = false;
let currentSlide;

const soundsName1 = audiosFirst.map(elem => elem.dataset.sound);
const soundsName2 = audiosSecond.map(elem => elem.dataset.sound);
const soundsName3 = audiosThird.map(elem => elem.dataset.sound);
audios.forEach(audio => audio.volume = 0.5);

let objLocalStorage = {
    localValue: '',
    isLocalStorage: true
};



//------------initial play
objLocalStorage.localValue = localStorage.getItem('currentSlide');
objLocalStorage.weatherCity = localStorage.getItem('weatherCity');

if(objLocalStorage.localValue) {
    currentSlide = +objLocalStorage.localValue;
    goToSlide(currentSlide);
    audioNames[0].innerHTML = soundsName1[currentSlide];
    audioNames[1].innerHTML = soundsName2[currentSlide];
    audioNames[2].innerHTML = soundsName3[currentSlide];
    delete objLocalStorage.localValue;
} else{
    currentSlide = 0;
    goToSlide(0);
    audioNames[0].innerHTML = soundsName1[0];
    audioNames[1].innerHTML = soundsName2[0];
    audioNames[2].innerHTML = soundsName3[0];
}

if(objLocalStorage.weatherCity) {
    getData(objLocalStorage.weatherCity);
}
// localStorage.clear()



//------------play&pause audios
function playAudio(currentSound, soundName1, soundName2, soundName3) {
    if(soundName1){
        isPlayFirstSound = true;
        audioNames[0].innerHTML = soundName1[currentSound];
        audiosFirst[currentSound].loop = 'loop';
        audiosFirst[currentSound].src = `assets/sounds/${soundName1[currentSound]}.mp3`;
        audiosFirst[currentSound].currentTime = 0;
        audiosFirst[currentSound].play();
    }
 
    if(soundName2){
        isPlaySecondSound = true;
        audioNames[1].innerHTML = soundName2[currentSound];
        audiosSecond[currentSound].loop = 'loop';
        audiosSecond[currentSound].src = `assets/sounds/${soundName2[currentSound]}.mp3`;
        audiosSecond[currentSound].currentTime = 0;
        audiosSecond[currentSound].play();
    }

    if(soundName3){
        isPlayThirdSound = true;
        audioNames[2].innerHTML = soundName3[currentSound];
        audiosThird[currentSound].loop = 'loop';
        audiosThird[currentSound].src = `assets/sounds/${soundName3[currentSound]}.mp3`;
        audiosThird[currentSound].currentTime = 0;
        audiosThird[currentSound].play();
    }
  }


function pauseAudio(prevSound, isFirst, isSecond, isThird) {
    if(isFirst){
        audiosFirst[prevSound].pause();
        isPlayFirstSound = false;
    }
    else if (isSecond){
        audiosSecond[prevSound].pause();
        isPlaySecondSound = false;
    } 
    else if (isThird){
        audiosThird[prevSound].pause();
        isPlayThirdSound = false;
    }
    else {
        audiosFirst[prevSound].pause();
        audiosSecond[prevSound].pause();
        audiosThird[prevSound].pause();
    }
}


//------------swipe slides
function nextSlide() {
  goToSlide(currentSlide + 1);
}

function previousSlide() {
  goToSlide(currentSlide - 1);
}

function goToSlide(n) {
    let prevSlide;
    let checkNumb;

    slides[currentSlide].className = 'slider-slide';
    checkNumb = currentSlide;
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].className = 'slider-slide active';

    if(checkNumb < n){
        prevSlide = (((currentSlide - 1) + slides.length) % slides.length );
    } else{
        prevSlide = (((currentSlide + 1) + slides.length) % slides.length );
    }

    pauseAudio(prevSlide);

    if(objLocalStorage.isLocalStorage === true){
        delete objLocalStorage.isLocalStorage;
    } else{
        playAudio(currentSlide, soundsName1, soundsName2, soundsName3);
        btnPauseFirst.classList.add('audio-toggle--pause');
        btnPauseSecond.classList.add('audio-toggle--pause');
        btnPauseThird.classList.add('audio-toggle--pause');
    }
    localStorage.setItem('currentSlide', `${currentSlide}`);  
}

//------------functions to pause audios
function pushBtnFirst() {
    if(isPlayFirstSound) {
        pauseAudio(currentSlide, true);
        btnPauseFirst.classList.remove('audio-toggle--pause');
    }
    else{
        playAudio(currentSlide, soundsName1);
        btnPauseFirst.classList.add('audio-toggle--pause');
    }  
}

function pushBtnSecond() {
    if(isPlaySecondSound) {
        pauseAudio(currentSlide, false, true);
        btnPauseSecond.classList.remove('audio-toggle--pause');
    }
    else{
        playAudio(currentSlide, null, soundsName2);
        btnPauseSecond.classList.add('audio-toggle--pause');
    }  
}

function pushBtnThird() {
    if(isPlayThirdSound) {
        pauseAudio(currentSlide, false, false, true);
        btnPauseThird.classList.remove('audio-toggle--pause');
    }
    else{
        playAudio(currentSlide, null, null, soundsName3);
        btnPauseThird.classList.add('audio-toggle--pause');
    }   
}


//------------change volume
function changeVolume(e) {
    if(e.target.classList.contains('audio-volume--first')) {
        let volume = audiosVolume[0].value / 100;
        audiosFirst[currentSlide].volume = volume;
    }

    if(e.target.classList.contains('audio-volume--second')) {
        let volume = audiosVolume[1].value / 100;
        audiosSecond[currentSlide].volume = volume;
    }

    if(e.target.classList.contains('audio-volume--third')) {
        let volume = audiosVolume[2].value / 100;
        audiosThird[currentSlide].volume = volume;
    }
}


//------------get weather Ajax
class City{
    constructor(city, temp, img, kindOfWeather, parent) {
        this.city = city;
        this.temp = temp;
        this.img = img;
        this.kindOfWeather = kindOfWeather;
        this.parent = parent;
    }
    render() {
        weatherInfo.innerHTML = '';
        weatherInner.classList.add('weather-inner');
        weatherInner.innerHTML = `<h3 class="weather-city">${this.city}</h3>
            <img class="weather-icon" src="https://openweathermap.org/img/w/${this.img}.png"></img>
            <div class="weather-description">
                <div class="weather-temperature">${Math.ceil(this.temp)}&#8451;</div>
                <div class="weather-appearance">${this.kindOfWeather}</div>
            </div>`;
        this.parent.append(weatherInner);
    }
  }

function getData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=5d066958a60d315387d9492393935c19`)
        .then(response => {
        if(response.ok) return response.json();
        else {
            alert('Please type exactly name of the city');
            getData();
        }
        })
        .then(data => {
            new City(
                data.name,
                data.main.temp,
                data.weather[0].icon,
                data.weather[0].main,
                weatherInfo
            ).render();
        })
        .catch(err => {
            console.warn(err);
        });
}

function onSubmitFormHandler(e){
    e.preventDefault();
    if(input.value === ''){
        alert('Please, enter the city');
        return;
    }
    weatherInner.remove();
    cityTitle = input.value.toUpperCase().trim();
    form.reset();
    getData(cityTitle);
    localStorage.setItem('weatherCity', `${cityTitle}`);
}
    

//------------touches
function getDataFromMouseDown(e) {
    pageXstart = 0;
    pageXstart += e.pageX; 
}

function getDataFromMouseUp(e) {
    pageXend = 0;
    pageXend += e.pageX;

    if(pageXstart < pageXend && Math.abs(pageXstart - pageXend) > 175) {
        previousSlide();
    }

    if(pageXstart > pageXend && Math.abs(pageXstart - pageXend) > 175) {
        nextSlide();
    }
}



//------------activate full screen
function activateFullscreen() {
    if(!isFullScreen){
    if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();  
        isFullScreen = true;      
    }
   
    else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen(); 
        isFullScreen = true;      // Firefox
      }
      else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
        isFullScreen = true;    // Safari
      }
      else if(document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
        isFullScreen = true;        // IE/Edge
      }
}
else{
    if(document.exitFullscreen) {
        document.exitFullscreen();
        isFullScreen = false;
    }
 
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        isFullScreen = false;
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        isFullScreen = false;
  } 
}
}


//------------listeners
btnPauseFirst.addEventListener('click', pushBtnFirst)
btnPauseSecond.addEventListener('click', pushBtnSecond)
btnPauseThird.addEventListener('click', pushBtnThird)
btnPrev.addEventListener('click', previousSlide);
btnNext.addEventListener('click', nextSlide);
audioContainer.forEach(audios => audios.addEventListener('change', changeVolume))
form.addEventListener('submit', onSubmitFormHandler);
sliderWrapper.addEventListener('mousedown', getDataFromMouseDown)
sliderWrapper.addEventListener('mouseup', getDataFromMouseUp)
screenBtn.addEventListener('click', activateFullscreen)


