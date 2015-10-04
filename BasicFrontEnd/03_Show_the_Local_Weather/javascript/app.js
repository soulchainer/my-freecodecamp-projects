$(document).ready(function(){
  function getLocationByIP() {
    // Get location based in IP, using Telize API
    var userip;
    var lat, lon;
    $.getJSON("http://www.telize.com/geoip?callback=?",
      function(json) {
        console.log(json);
        var lat = json.latitude, lon = json.longitude;
        getWeatherInfo(lat, lon);
      }
    );
  }
  function getLocation() {
    // Get location with HTML5 Geolocation API
    function success(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      getWeatherInfo(lat, lon);
    }
    function error() {
      var geoLocationByIP = confirm("It was impossible to get your location using the geolocation API." + confirmMessage );
      if (geoLocationByIP){
        getLocationByIP();
      }
    }

    var options = {
      enableHighAccuracy: false,
      maximumAge: 600000,
      timeout: 20000
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  function getWeatherInfo(lat, lon){
    // Fill all Weather data, using OpenWeatherMap API
    function setApiKey(appid, message) {
      // Set appid with the API key to use for OpenWeatherMap
      // If appid exist, "cancel" will preserve the actual API key
      var key;
      do {
        key = prompt(message);
        if (key) {
          localStorage.setItem("appid", key);
          appid = key;
        }
      } while (!appid);
    }
    var appid;
    if (!appid && localStorage.getItem("appid")) {
      appid = localStorage.getItem("appid");
    } else {
      var message = "You must provide an OpenWeatherMap API Key for this site to work (it's the weather info source).\n\nYou can get one for free at http://openweathermap.org/appid.\n\nEnter here your OpenWeatherMap API key:";
      setApiKey(appid, message);
    }
    var unitSystem;
    // get the measure unit
    if (localStorage.getItem("units")) {
      unitSystem = localStorage.getItem("units");
    } else {
      unitSystem = "metric";
      localStorage.setItem("units", unitSystem);
    }
    var metric = unitSystem === "metric";
    var MILE = 1.609344;

    function decimalRound(n, d) {
      // Return n round with d decimal positions, without trailing zeros
      var num = Number(n);
      if (d) {
        var tens = Math.pow(10, d);
        return Math.round(num*tens)/tens;
      }
      return Math.round(num);
    }

    function lengthConversion(isMetric, value) {
      // Convert lengths from metric to imperial and viceversa
      var length = (isMetric)?value/MILE:value*MILE;
      return decimalRound(length,1);
    }

    function tempConversion(isMetric, value) {
      // Convert temperature from Kelvin.
      // Conversion to other units than default is made in server, and that is
      // mainly for resource-limited embedded applications.
      var temp = (isMetric)? value-273.15: value*1.8-459.67;
      return decimalRound(temp, 1);
    }

    function toggleUnitSystem(isMetric){
      // Toggle the units being shown and return the unit system name
      var system = (isMetric)? "imperial": "metric";
      localStorage.setItem("units", system);
      $(".front, .back").toggleClass("flip");
      return system;
    }

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?&lat=" + lat + "&lon=" + lon + "&APPID="+ appid,
        // The name of the callback parameter
        jsonp: "callback",
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        // Work with the response
        success: function( r ) {
          function calculateDayPercent(now, sunrise, sunset) {
            // Return the percentage of day passed (from
            // sunrise to sunset), like: "80" for 80%.
            if ((now <= sunrise) ||
               ((now > sunset) && (to12HourFormat(now).indexOf("AM") != -1))) {
              return 0;
            } else if (now >= sunset) {
              return 100;
            }
            var lightTime =  sunset - sunrise;
            var timeElapsed = now - sunrise;
            var percent = (timeElapsed/lightTime) * 100;
            return Math.round(percent);
          }
          function getWIconClass(code, time) {
            var day = "wi wi-owm-day-";
            var night = "wi wi-owm-night-";
            return (time === "day")? day + code: night + code;
          }
          function setBackground(code, time){
            // get the background image according to weather conditions
            var clouds = [800, 801, 802, 803].indexOf(code) != -1;
            var fileName = (clouds)? code+time[0]: code;
            fileName +=".jpg";
            $("body").css("background-image", "url(assets/" + fileName + ")");
          }
          function to12HourFormat(secsFromEpoch){
            // Return the hour in format "HH:MM:SS AM/PM"
            var date = new Date(secsFromEpoch*1000);
            var hh = date.getHours();
            var mm = date.getMinutes();
            var hour = (hh > 12)? hh - 12 + ":"+mm+" PM":hh+":"+mm+" AM";
            return hour;
          }
          function fillData(key, data, value, altValue){
            // Fill weather data, of present and alternative unit system
            $(key).attr(data,value)
            .children().attr(data,altValue);
          }
          function fillDataAndUnhide(key, data, value){
            // Fill weather data and show it
            // ("More details" fields are hidden if data isn't available)
            if (arguments.length > 4) {
              value = decimalRound(value, arguments[4]);
            }
            $(key).attr(data, value).parent(".details")
            .removeClass("hidden");
          }
          console.log(r);
          var dt = r.dt;
          var sunrise = r.sys.sunrise;
          var sunset = r.sys.sunset;
          var time = ((dt >= sunrise) && (dt < sunset))? "day":
          "night";
          var weather = r.weather[0];
          var main = r.main;
          $("#wi-now").addClass(getWIconClass(weather.id, time));
          $(".country").addClass("flag-"+ r.sys.country.toLowerCase());
          $(".city").text(r.name);
          $("#description").text(weather.description);
          $.each({"#temp": main.temp, "#temp_min": main.temp_min,
                  "#temp_max": main.temp_max}, function(key, value){
            if (value !== undefined) {
              altValue = tempConversion(!metric, value);
              value = tempConversion(metric, value);
              if (!metric) {
                fillData(key, "data-unit", "F", "C");
              }
              fillData(key, "data-value", value, altValue);
            }
          });
          if (!metric) {
            fillData("#degrees", "data-unit", "F", "C");
          }
          if (main.hasOwnProperty("humidity")) {
            fillDataAndUnhide("#humidity", "data-value", main.humidity);
          }
          if (main.hasOwnProperty("pressure")) {
            var pressure = main.pressure;
            var sea = main.hasOwnProperty("sea_level");
            var grnd = main.hasOwnProperty("grnd_level");
            if ((sea && grnd) || sea) {
              $.each({"#pressure-sea": main.sea_level, "#pressure-grnd": pressure}, function(key, value){
                fillDataAndUnhide(key, "data-value", value, 2);
              });
            } else if (grnd) {
              $.each({"#pressure-sea": pressure, "#pressure-grnd": main.grnd_level}, function(key, value){
                fillDataAndUnhide(key, "data-value", value, 2);
              });
            } else {
              fillDataAndUnhide("#pressure-sea", "data-value", pressure, 2);
            }
          }
          if (r.hasOwnProperty("visibility")) {
            var visibility = r.visibility;
            if (!metric){
              fillData("#visibility", "data-unit", "mi", "m");
              visibility /= 1000;  // conversion to kilometers
            }
            fillDataAndUnhide("#visibility", "data-value", visibility);
            $("#visibility").children()
            .attr("data-value",
                  lengthConversion(metric, visibility));
          }
          if ((r.hasOwnProperty("clouds")) &&
             (r.clouds.hasOwnProperty("all"))) {
            fillDataAndUnhide("#clouds", "data-value", r.clouds.all);
          }
          if (r.hasOwnProperty("rain") &&
              r.rain.hasOwnProperty("3h")){
            fillDataAndUnhide("#rain-vol", "data-value", r.rain["3h"], 2);
          }
          if (r.hasOwnProperty("snow") &&
              r.snow.hasOwnProperty("3h")) {
            fillDataAndUnhide("#snow-vol", "data-value", r.snow["3h"], 2);
          }
          if (r.hasOwnProperty("wind")){
            if (r.wind.hasOwnProperty("speed")) {
              var speed = r.wind.speed;
              if (!metric){
                fillData("#speed", "data-unit", "mph", "Km/h");
              }
              fillDataAndUnhide("#speed", "data-value", speed, 1);
              $("#speed").children()
              .attr("data-value", lengthConversion(metric, speed));
            }
            if (r.wind.hasOwnProperty("deg")){
              var deg = decimalRound(r.wind.deg, 1);
              fillDataAndUnhide("#deg", "data-value", deg);
              $("#wind-dir")
              .css({"transform": "rotate("+deg+"deg)", "ms-transform": "rotate("+deg+"deg)", "webkit-transform": "rotate("+deg+"deg)"});
            }
          }
          $("#sunrise").text(to12HourFormat(sunrise));
          $("#sunset").text(to12HourFormat(sunset));
          var dayPercent = calculateDayPercent(dt, sunrise, sunset);
          $("#progressbar").css("width", dayPercent + "%")
          .attr("aria-valuenow", dayPercent)
          .children(".sr-only").text(dayPercent+ "% Complete");
          setBackground(weather.id, time);
          getWIconClass(weather.id, time);
        }
    });
    $("#toggle-degrees").click(function(){
      unitSystem = toggleUnitSystem(metric);
      metric = !metric;
    });
    $("#change-key").click(function(){ // Change the saved API key on click
      var message = "Enter here your new OpenWeatherMap API key:";
      setApiKey(appid, message);
    });
  }

  var confirmMessage = "\nWe still can try to get your geolocation based in your IP, but the results could be worse.\nDo you want to continue?\n\nIMPORTANT: Certain browser addons, like uBlock, can block this to work, so, if you get any trouble, try disabling that kind of addons.";
  var hasGeolocation = "geolocation" in navigator;
  if (hasGeolocation) {
    getLocation();
  } else {
    var geoLocationByIP = confirm("Geolocation API is not available in your browser." + confirmMessage);
    if (geoLocationByIP){
      getLocationByIP();
    }
  }
});
