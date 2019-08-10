var popCities = ['San Francisco', 'Los Angeles', 'New York', 'Moscow', 'Toronto']
// function that adding buttons with popular cities
function renderButtons() {
    $('#popCity').empty();
    for (i = 0; i < popCities.length; i++) {
        createButtons(popCities[i]);
    }
}
renderButtons();

//function that creates new buttons with class="cName" and appending new buttons to existing ones
function createButtons(cName) {
    var b = $('<button>');
    b.attr('class', 'cName btn btn-info')
    b.text(cName);
    $("#popCity").append(b);
    $("#popCity").append(" ");
};
//function that adding new button with new city
$("#citySubmit").on("click", function (event) {
    var newCity = $("#cityChoice").val();
    console.log(newCity);
    createButtons(newCity);
    popCities.push(newCity);
    event.preventDefault();
    $("#cityChoice").val("");
});
/// This is where out Music API JS is //////////////////////////////////////
var apiKey = '?api_key=UPVjVwevOqPChTS9FFJ6lm8GhpmtVLPm';
var searchHot = ["sweating", "very hot", "summer fun"];
var searchGood = ["chilling", "relax time", "nice weather"];
var searchCold = ["brrr", "i am freezing", "blizzard"];
var apiURL;
var q = "The Terminator";




/// This is where out weather API JS is //////////////////////////////////////
// This is our API key
var APIKeyWeather = "166a433c57516f51dfab1f7edaed8413";
var city;
var queryURLWeather;

console.log(queryURLWeather)
function getMovie(){
    var movieURL = "https://www.omdbapi.com/?t="+ q + "&apikey=trilogy"
    $.ajax({
        url: movieURL,
        method: "GET"
    })
.then(function(response){
    console.log(response);
         var pTitle = $('<p>').text(response.Title);
         var pActors = $('<p>').text(response.Actors);
         var pPlot = $('<p>').text(response.Plot);
         var imgPoster = $('<img>').attr('src', response.Poster);
         var d = $('<div>').append(pTitle, imgPoster, pPlot, pActors);
        $('#movieList').html(d);
         })
     };

// Here we run our AJAX call to the OpenWeatherMap API
$(document).on('click', ".cName", function () {
    city = $(this).text()
    // $('#chosenCity').text(city);
    event.preventDefault();
    console.log(city);
    queryURLWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKeyWeather}`;

    $.ajax({
        url: queryURLWeather,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            // Log the queryURLWeather
            console.log(queryURLWeather);

            // Log the resulting object
            console.log(response);
            console.log(response.main.temp)

            // Transfer content to HTML
            $(".city").html("<h1><span id='cityName'></span> Weather Details</h1>");
            $(".wind").html("<p>Wind Speed: <span class='windSpan'></span></p> ");
            $(".humidity").html("<p>Humidity: <span class='humSpan'></span></p>");
            $(".temp").html("<p>Temperature (F): <span class='tempSpan'></span></p>");

            //Fill weather info into variables
            cityTemp = response.main.temp; //Temp
            cityHum = response.main.humidity; //Humidity
            cityWind = response.wind.speed; //Wind Speed
            cityName = response.name
            citySky = response.weather[0].main
console.log(citySky);
            //Pushs weather info into database
            weatherDBPush()
           
            //Checks the tempature and displays the correct music on the page
            if (citySky == ["Rain", "Drizzle", "Thunderstorm"]) {
                // q = searchHot;
                getMovie()
              
            } else if (citySky ==["Snow", "Atmosphere"]) {
                // q = searchGood;
                getMovie()
            } else if (citySky == ["Clear"]) {
                // q = searchCold;
              getMovie();
            }else if (citySky == "Clouds"){
            console.log("test");
            getMovie();
        }
        });
})

// Firebase Code///////////////////////////////////////////////////////////
var config = {
    apiKey: "AIzaSyBxj0TEF8tSw7qvhgICM8wr7briVblXdlM",
    authDomain: "geoffs-db-1.firebaseapp.com",
    databaseURL: "https://geoffs-db-1.firebaseio.com",
    projectId: "geoffs-db-1",
    storageBucket: "geoffs-db-1.appspot.com",
    messagingSenderId: "700166027767",
    appId: "1:700166027767:web:2ae2df8992d3db12"
};

firebase.initializeApp(config);

const db = firebase.database();

var cityWind;
var cityTemp;
var cityHum;
var cityTemp;
var cityName;
var citySky;

function weatherDBPush() {
    db.ref().push({
        Temp: cityTemp,
        Humidity: cityHum,
        WindSpeed: cityWind,
        City: cityName,
        Time: firebase.database.ServerValue.TIMESTAMP
    });
}

db.ref().on("value", function (snapshot) {
    var data = snapshot.val();

    for (var key in data) {
        var value = data[key];
        $('#cityName').text(cityName)
        $('.windSpan').text(value.WindSpeed);
        $('.humSpan').text(value.Humidity);
        $('.tempSpan').text(value.Temp);
    }
});