$(document).ready(function(){
    $("#submitForecast").click(function(){
        return getForecast();
    });
});

function getForecast(){
    var city = $("#city").val();

    if(city != ''){

        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&units=metric&cnt=7&APPID=a1fae70bf70564388adf526ed698c6d4',
            type: "GET",
            dataType: "jsonp",
            success: function(data){
                // console.log(data);
                var table = '';
                var header = '<h2 style="font-weight:bold; font-size:30px; margin-top:20px;">Weather forecast for ' + data.city.name + ', ' + data.city.country + '</h2>'
                var accumulator = 0;
                for(var i = 0; i < data.list.length; i++){

                    date = new Date();
                    currentDate = date.setDate(date.getDate() + i);
                    accumulator += data.list[i].pressure;

                    table += "<tr>";
                    table += "<td id='c"+ i +"'>" + new Date(currentDate) + "</td>";
                    table += "<td><img src='http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png'></td>";
                    table += "<td>" + data.list[i].weather[0].description + "</td>";
                    table += "<td>" + data.list[i].temp.min + "&deg;C</td>";
                    table += "<td>" + data.list[i].temp.max + "&deg;C</td>";
                    table += "<td>" + data.list[i].pressure + "hPa</td>";
                    table += "</tr>";

                }

                accumulator = Math.round(accumulator/7);
                var averagePressure = '<h2 style="font-weight:bold;">The average pressure over the next 7 days is ' + accumulator + ' hPa<h2>';

                $("#forecastWeather").html(table);
                $("#header").html(header);
                $("#averagePressure").html(averagePressure);
                $("#city").val('');

								google.charts.load('current', {'packages':['corechart'], callback: drawVisualization});

						      function drawVisualization() {
						        // Some raw data (not necessarily accurate)

						        var chartData = google.visualization.arrayToDataTable([
						         ['Day', 'Min. Temp', 'Max Temp', 'Pressure'],
						         [$("#c0").html(),  data.list[0].temp.min,      data.list[0].temp.max, data.list[0].pressure],
						         [$("#c1").html(),  data.list[1].temp.min,      data.list[1].temp.max, data.list[1].pressure],
						         [$("#c2").html(),  data.list[2].temp.min,      data.list[2].temp.max, data.list[2].pressure],
						         [$("#c3").html(),  data.list[3].temp.min,      data.list[3].temp.max, data.list[3].pressure],
						         [$("#c4").html(),  data.list[4].temp.min,      data.list[4].temp.max, data.list[4].pressure],
										 [$("#c5").html(),  data.list[5].temp.min,      data.list[5].temp.max, data.list[5].pressure],
										 [$("#c6").html(),  data.list[6].temp.min,      data.list[6].temp.max, data.list[6].pressure]

						      	]);

								    var options = {
								      title : '7 Day Forecast',
								      vAxis: {
															0:{title: 'Temperature C'},
															1:{title: 'Pressure hPa'}
														 },
								      hAxis: {title: 'Days'},
											series: {
																0:{targetAxisIndex:0},
																1:{targetAxisIndex:0},
																2:{targetAxisIndex:1, type:'line'}
															},
								      seriesType: 'bars',
								    };

						    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
						    chart.draw(chartData, options);
						  }
            }
        });
    }else{
        $("#error").html("<div class='alert alert-danger' id='errorCity'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>City field cannot be empty</div>");
    }
}
