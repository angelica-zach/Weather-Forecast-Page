

// .on("click") function associated with the Search Button
$("#search-button").on("click", function (event) {
   // Prevents the page from reloading on form submit.
    event.preventDefault();
    var cityName= $("#search-input").val().trim();
    saveValue(cityName);
    searchCity(cityName);
});

    function searchCity(cityName){
//   clearing fields
    $("#today").empty();
    $("#forecast").empty();
    // Build the query URL for the Fetch request to the NYT API
    var queryURL="https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid=0c53bbce1f5e838ec2b1fbee398b8cbb";
  
    // Make the Fetch request to the API - GETs the JSON data at the queryURL.
   
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function(data){
        var city=data.city.name;
        var amount=data.cnt;
        
        
        // todays forecast
        var title = $("<h2>");
        var dateToday=data.list[0].dt_txt.split(" ")[0];
        var dayUnix=data.list[0].dt;
        var day= dayjs.unix(dayUnix).format("DD/MM/YYYY");
        title.text(city +"[" +day +" ]");
        // getting conditions
        var temp=$("<p>");
        var wind=$("<p>");
        var humid=$("<p>");
        var humidReal=(data.list[0].main.humidity);
        var windReal=(data.list[0].wind.speed)
        var tempReal=(data.list[0].main.temp)-273.15;
        temp.text("Temperature :"+ tempReal.toFixed(2) + "°C");
        wind.text("Wind :"+ windReal + "KPH");
        humid.text("Humidity :"+ humidReal + "%");
        // adding images
        var img=$("<img>");
        var iconcode = data.list[0].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $(img).attr('src', iconurl);

        $(title).append(wind);
        $(title).append(humid);
        $(title).append(temp);
        $("#today").append(title);
        $(title).prepend(img);

        //future forecast
        for (i=0;i<amount;i++){
            var timePart = data.list[i].dt_txt.split(" ")[1];
            var datePart=data.list[i].dt_txt.split(" ")[0];
        // getting midday weather
            if ((timePart=="12:00:00")&&(datePart!=dateToday)) {
                var dayBlock=$("<div>");
                var title = $("<h2>");
            //    formatting date to match
                title.text("["+dayjs(datePart).format("DD/MM/YYYY")+"]");
                var temp=$("<p>");
                var wind=$("<p>");
                var humid=$("<p>");
                var humidReal=(data.list[i].main.humidity);
                var windReal=(data.list[i].wind.speed)
            var tempReal=(data.list[i].main.temp)-273.15;
            temp.text("Temperature :"+ tempReal.toFixed(2) + "°C");
            wind.text("Wind :"+ windReal + "KPH");
            humid.text("Humidity :"+ humidReal + "%");
            var img=$("<img>");
            var iconcode = data.list[0].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            $(img).attr('src', iconurl);
        
            $(title).append(wind);
            $(title).append(humid);
            $(title).append(temp);
            $(title).prepend(img);
            $(dayBlock).append(title);
            $("#forecast").append(dayBlock);
            };
     };
  });
};
// saving history
function saveValue(cityName) {
    var searchHistory = getSearchHistory();
    // Add the new search term to the history if it is not alreadly present
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
    }
    // Keep only the five most recent searches
    if (searchHistory.length > 5) {
        searchHistory = searchHistory.slice(-5);
    }
    saveSearchHistory(searchHistory);
    updateSearchHistory();
};


 function getSearchHistory() {
    var storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
        return JSON.parse(storedHistory);
  };
};

  // Function to save the search history to LocalStorage
  function saveSearchHistory(searchHistory) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  };

  function updateSearchHistory(){
    //clear div
    $("#history").empty();
    // creating buttons
    var searches=getSearchHistory();
    searches.forEach((city, index) => {
        var button = $("<button>");
        button.text(city);
        button.on('click', () => searchCity(city));
        $("#history").prepend(button);
      });
  };
// repeat every few minutes