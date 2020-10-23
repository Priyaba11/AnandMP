//Populating cards on home page
const apiid = 'cea03fcf5683dfd51a65351dc227a687';
const url = 'http://api.openweathermap.org/data/2.5/group?appid=' + apiid + '&id=1273294,524901,2643743,5128581,1275339,1277333,1279233,1273874&units=metric';
fetch(url).then(function (response) {
    return response.json();
}).then(function (json) {
    let climate = json;
    for (var i = 0; i < 8; i++) {
         $("#cardtitle" + i).html(climate['list'][i].name);
        $("#temp" + i).html(climate['list'][i].main.temp + "&#8451");
        $("#card-text" + i).html(climate['list'][i].weather[0].description);
        $("#wind" + i).after(climate['list'][i].wind.speed + "m/s winds");
        $("#humidity" + i).after(climate['list'][i].main.humidity + "% humidity");
    }
    console.log(climate['list'][0].main.temp, climate['list'][0].name, climate['list'][0].weather[0].description);
}).catch(function (err) {
    console.log('fetch error' + err.message);
});


function search() {
    let city = $('#cityname').val().toLowerCase();
    sessionStorage.setItem('city', city);
}

function searchByCard(){
    let city=$('#'+($(this).attr('id'))).val().toLowerCase();
    console.log(city);
    sessionStorage.setItem('city',city);
}

//getting data and populating search page
$(function () {
    let city = sessionStorage.getItem('city');
    fetch('http://api.openweathermap.org/data/2.5/weather?appid=' + apiid + '&q=' + city + '&units=metric')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            let climatetemp = json;
            fetch('https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=' + climatetemp.coord.lat + '&lon=' + climatetemp.coord.lon + '&dt=' + climatetemp.dt + '&appid=' + apiid+'&units=metric')
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    let climate = json;
                    $("#cardtitle").html(climatetemp.name);
                    $("#temp").html(climate.current.temp + "&#8451");
                    $("#card-text").html(climate.current.weather[0].description);
                    $("#wind").after(climate.current.wind_speed + "m/s winds");
                    $("#humidity").after(climate.current.humidity + "% humidity");

                    //BarChart
                    $.ajax({
                        type: 'GET',
                        DataType: 'json',
                        url: `http://api.weatherapi.com/v1/forecast.json?key=782d4e563c8c48549c082006201610&q=${city}&days=3`,
                        success: function (res) {
        
                       console.log(res.forecast.forecastday[2].date)
                       console.log(res.forecast.forecastday[2].day.maxtemp_c)
                       console.log(res.forecast.forecastday[2].day.mintemp_c)
                       google.charts.load('current', {'packages':['bar']});
                       google.charts.setOnLoadCallback(drawChart);
                       function drawChart() {
                           var data = google.visualization.arrayToDataTable([
                             ['Date', 'Temp_min', 'Temp_max'],
                             [res.forecast.forecastday[0].date, res.forecast.forecastday[0].day.mintemp_c,res.forecast.forecastday[0].day.maxtemp_c],
                             [res.forecast.forecastday[1].date, res.forecast.forecastday[1].day.mintemp_c,res.forecast.forecastday[1].day.maxtemp_c],
                             [res.forecast.forecastday[2].date, res.forecast.forecastday[2].day.mintemp_c,res.forecast.forecastday[2].day.maxtemp_c],
                           
                           ]);
                       
                           var options = {
                             chart: {
                               title: 'Temperature Difference',
                               subtitle: 'daily-temp_min,temp_max,',
                             },
                             bars: 'vertical' // Required for Material Bar Charts.
                           };
                       
                           var chart = new google.charts.Bar(document.getElementById('barchart_material'));
                           $('#barchart_material').empty()
                           chart.draw(data, google.charts.Bar.convertOptions(options));
                         }
                     }
        
        
                 })
                })
        })
    console.log(city);
})

function getLocation() {
    console.log("clicked")
    var city = ''
    $.ajax({
        url: "https://geolocation-db.com/jsonp",
        jsonpCallback: "callback",
        dataType: "jsonp",
        success: function (location) {
            city = location.city
            sessionStorage.setItem('city', city);
        }
    })
}