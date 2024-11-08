const Api_key = "2fd0a318e501d357f164156824815772";
const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`;
const auto_btn = document.querySelector("#auto");
const mannual_btn = document.querySelector("#mannual");
let label = document.querySelector("label");
let input = document.querySelector("input");
let heading = document.querySelector("header>h1")
let dropdown = document.querySelector("#dropdown")
let body = document.querySelector("body")



body.addEventListener("click",()=>{
  dropdown.style.display = "none";
},true)
dropdown.addEventListener("click",(e)=>{
  if(e.target.tagName="P"){
    input.value=e.target.innerText
    dropdown.style.display = "none";
  }
})

auto_btn.addEventListener("click", (e) => {
  e.preventDefault();
  label.innerText = "Enter a City Name";
  label.classList.remove("text-red-500")
  getlocation(e);
});

mannual_btn.addEventListener("click", (e) => {
  e.preventDefault();
  let city = cityChecker();
  if (city) {
    getLocationByCity(city);
    getforecastData(city);
  }
 
});

input.addEventListener("click", () => {
  label.innerText = "Enter a City Name";
  label.classList.remove("text-red-500");
  const array = JSON.parse(localStorage.getItem("myArray")); 
  displayCity(array)
});

input.addEventListener("input",()=>{
  let city =input.value
  let allcities = JSON.parse(localStorage.getItem("myArray"));
 let lola =  allcities.filter((e)=>{
  if(e.includes(city)){
    return e
  }
 })
 if(lola.length>=1){
  displayCity(lola)
 }
 else{
  dropdown.style.display = "none";
 }

})

function cityChecker() {
  let input = document.querySelector("input");
  let value = input.value.trim();
  if (value === ""||!isNaN(value)) {
    label.innerText = "Please Enter a Valid City!";
    label.classList.add("text-red-500");
  } else {
    input.value=""
    return value;
  }
}

// funtion for change string to day and time

function timeanddate(lol) {
  let timestamp = lol; // Unix timestamp in seconds
  let date = new Date(timestamp * 1000); // Multiply by 1000 to convert to milliseconds
  // Get the day and date
  let day = date.toLocaleString("en-US", { weekday: "long" }); // Example: "Saturday"
  let formattedDate = date.toLocaleDateString("en-US"); // Example: "11/6/2024"
   let obj ={
    day:day,
    date:formattedDate
   }
   return obj
}

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successful retrieval of location
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        let oneApi = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Api_key}&units=metric`;
        fetch(oneApi)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            extractData(data)
            getforecastData(data.name)
          });
      },
      (error) => {
        // Handle any errors that occur
        console.log("Error retrieving location:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function getLocationByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`;
  console.log(city);
  try {
    let data = await fetch(url);
    if (!data.ok) throw new Error(`${data.status}`);
    let resdata = await data.json();
    extractData(resdata)
   
  } catch (err) {
    if (err.message == "404") {
      console.log("city not found");
    } else if (err instanceof TypeError) {
      console.log("Please check your internet connection");
    } else {
      console.log("some unoccure found plz try again");
    }
  }
}

async function getforecastData(city) {
  const API = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${Api_key}&units=metric`;
  try {
    let data = await fetch(API);
    if (!data.ok) throw new Error(`${data.status}`);
    let resdata = await data.json();
    extractforecastData(resdata,city)
   
  } catch (err) {
    if (err.message == "404") {
    label.innerText  ="city not found! Try Again"
    label.classList.add("text-red-500");
    } else if (err instanceof TypeError) {
      console.log("Please check your internet connection");
    } else {
      console.log("some unoccured found please try again",err);
    }
  }
}


 function extractforecastData(data,city){
    
   let newData= data.list.filter((e)=>{
    if(data.list.indexOf(e)==8||data.list.indexOf(e)==16||data.list.indexOf(e)==24||data.list.indexOf(e)==32||data.list.indexOf(e)==39){
      return e
    }
   })
  //  newData.shift()
   let forecastWeather =[]
   let dayAndDate = []
   
   for(let data of newData){
    let abc= timeanddate(data.dt)
    dayAndDate.push(abc)}
  
 for(let data of newData){
  let weather = {
    temprature: data.main.temp,
    wind: data.wind.speed,
    day:dayAndDate[newData.indexOf(data)].day,
    date:dayAndDate[newData.indexOf(data)].date,
    city_name:city,
    humidity: data.main.humidity,
    status: data.weather[0].main,
    description: data.weather[0].description,
  }

    forecastWeather.push(weather)
 }

 displayforecastData(forecastWeather)

 }

function extractData(data){
    let dayAndDate= timeanddate(data.dt)
  let weather = {
    temprature: data.main.temp,
    wind: data.wind.speed,
    day:dayAndDate.day,
    date:dayAndDate.date,
    city_name:data.name,
    humidity: data.main.humidity,
    status: data.weather[0].main,
    description: data.weather[0].description,
  }

  displayData(weather)
}

function displayData(weather){
     let div = document.querySelector("#displayData")
     let infodiv = document.querySelector("#infoText")
     let weather_img = document.querySelector("#weather_img")
     div.style.display = "flex";
     storeCity(weather.city_name)
    heading.innerHTML=`CloudVista &nbsp;<i class="fa-solid fa-cloud"></i><span class="font-bold">&nbsp;- Weather of ${weather.city_name}</span> `
      infodiv.innerHTML=`
       <h1>${weather.city_name}</h1>
        <p class="text-3xl sm:text-4xl font-semibold">${weather.day}</p>
        <p class="text-5xl sm:text-6xl font-bold text-gray-500">${Math.floor(weather.temprature)}&deg;C</p>
        <p>Humidity: ${weather.humidity}%</p>
        <p>wind: ${weather.wind} M/S</p>
        <p class="border-2 p-1 px-2 w-fit rounded-lg text-white bg-yellow-300 font-semibold">${ weather.status}</p>
      `
     
       if(weather.status=="Haze"){
        weather_img.setAttribute("src","/images/sun.png")
       }
       else if (weather.status=="Mist"){
        weather_img.setAttribute("src","/images/mist.png")
       }
       else if(weather.status=="Clouds"){
        weather_img.setAttribute("src","/images/cloudy.png")
       }
       else if(weather.status=="Clear"){
        weather_img.setAttribute("src","/images/sun (2).png")
       }
       else if(weather.status=="Rain"){
        weather_img.setAttribute("src","/images/rainny.png")
       }
}

function displayforecastData(weather){
 
  let fiveDaysDiv= document.querySelector("#fivedays")
      fiveDaysDiv.style.display="flex"
         for(let i=0;fiveDaysDiv.children.length>i;i++){
                  
            fiveDaysDiv.children[i].innerHTML=`

             <div class="absolute inset-0 bg-white opacity-60"></div>
      <p class="text-2xl z-10 font-semibold">${weather[i].day}</p>
      <p class="text-4xl z-10 font-bold">${Math.floor(weather[i].temprature)}&deg;C</p>
      <p class="z-10">Humidity: ${weather[i].humidity}%</p>
      <p class="z-10">wind: ${weather[i].wind} M/S</p>
      <p class="border-2 z-10 px-2 w-fit rounded-lg text-white bg-yellow-300 font-semibold">${weather[i].status}</p>
    </div>
            `   
            
             if(weather[i].status=="Clouds"||weather[i].status=="Rain"){
            
              fiveDaysDiv.children[i].classList=`relative bg-[url('/images/rainny_weather.jpg')] bg-cover bg-opacity-10 bg-center h rounded-md w-44 h-full flex items-center gap-1 flex-col`
            }
           else if(Math.floor(weather[i].temprature)>15){
            
              fiveDaysDiv.children[i].classList=`relative bg-[url('/images/istockphoto-1007768414-612x612.jpg')] bg-cover bg-opacity-10 bg-center h rounded-md w-44 h-full flex items-center gap-1 flex-col`
             }
            else{
              fiveDaysDiv.children[i].classList=`relative bg-[url('/images/badge-snowcovered.jpg')] bg-cover bg-opacity-10 bg-center h rounded-md w-44 h-full flex items-center gap-1 flex-col`
             }


         }
}

function storeCity(city){
const existingArray = JSON.parse(localStorage.getItem("myArray")) || [];
const newItem = city.toLowerCase(); 
if(!existingArray.includes(newItem)){
  console.log("ha bolo")
  existingArray.unshift(newItem);
}
localStorage.setItem("myArray", JSON.stringify(existingArray));
}

function displayCity(array){
  if(array.length>4){
    array.length=5
  }
  dropdown.innerHTML=""
  dropdown.style.display = "flex";
  for ( let city of array){
   let p= document.createElement("p")
   p.innerText=city
   p.classList="p-1 px-2  hover:bg-gray-300 border-black bg-white"
   dropdown.appendChild(p)
  }
}


