/*// производим вычисления необходимые для метода наименьших квадратов
                    var n = d1.data.length;
                    var multiSumm = 0;
                    var summX = 0;
                    var summY = 0;
                    var summSquareX = 0;
                    for (var i = 1; i <= n; i++) {
                            multiSumm = multiSumm + i*d1.data[i-1].y;
                            summY = summY + d1.data[i-1].y;
                            summX = summX + i;
                            summSquareX = summSquareX + Math.pow(i, 2);
                    }

                    var k = (n*multiSumm - summX*summY) / (n*summSquareX - Math.pow(summX, 2));
                    var b = (summY - k*summX) / n;
                    
                    console.log(k);
                    console.log(b);

                    var d_trend = [];
                    for (var i = 0; i < n; i++) {
                            d_trend.push({x: d1.data[i].x, y: k*i + b});
                    }*/

/*
    var sensor_add = "pressure";
    var period_add = "day";  
    //sensor_id = sensorToId[sensor][0];
    var dataForChart_add = [];
    var maxValue_add = -100000;
    var minValue_add = 100000;
    var request_hist_add = "https://narodmon.ru/api/sensorsHistory?id=" + sensor_id + "&period=" + period + "&offset=0&uuid=9360bc15113a0e83a569e4c4dc33f496&api_key=3MraBhgVgmG9n";
    var req_hist_add = new XMLHttpRequest();
    req_hist_add.open("GET", request_hist_add, true);
    req_hist_add.onreadystatechange = function () {
    if (req_hist_add.readyState == 4 && req_hist_add.status === 200) {
        jsonDecode_add = JSON.parse(req_hist_add.responseText); 
        //console.log(jsonDecode.data.length);
        var i; 
        for (i=0; i<jsonDecode_add.data.length; i++){
                if (jsonDecode_add.data[i].value < minValue_add){
                    minValue_add = jsonDecode_add.data[i].value;
                }
                if (jsonDecode_add.data[i].value > maxValue_add){
                    maxValue_add = jsonDecode_add.data[i].value;
                }
                dataForChart_add.push({x: new Date(jsonDecode_add.data[i].time * 1000), y: jsonDecode_add.data[i].value});
            }
        }

    var d_add = new Object({"data": dataForChart_add, "min": minValue_add, "max": maxValue_add, "titleY": sensorToId[sensor_add][2], "period": period_add, "titleLegend": sensorToId[sensor_add][1], "graphColor": sensorToId[sensor_add][3]});

*/