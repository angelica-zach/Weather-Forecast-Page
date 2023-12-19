


// .on("click") function associated with the Search Button
$("#search-button").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
    var cityName= $("#search-input").val().trim();
  
  
    // Build the query URL for the Fetch request to the NYT API
    var queryURL="https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid=0c53bbce1f5e838ec2b1fbee398b8cbb";
  
    // Make the Fetch request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function(data){
        var city=data.city.name;
        var amount=data.cnt;
        console.log(data);
        console.log(data.list[0]);
        
    //     for (i=0;i<amount;i++){
    //         day=;
    //         time=;
    //         temperature=;
    //         wind=;
    //         humidity=;
    //     }
    //     icon=;
    //     day.append(icon);
    //     [today]
    // var today=$("#today")
    var title = $("<h2>");
    var dayUnix=data.list[0].dt;
   var day= dayjs.unix(dayUnix).format("DD/MM/YYYY");
    title.text(city + day );
    $("#today").append(title);
    // var temp = ("<p>");
    // temp.text(temperature+"C")
    //     [forecast]
    //   };
  });
});
  
// repeat every few minutes