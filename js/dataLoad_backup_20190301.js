
    var sensorToId = new Object({
        'temp': ["31053", "Температура", String.fromCharCode(176) + "C", "rgb(255, 50, 50)"],
        "hum": ["31054", "Влажность", "%", "rgb(0, 28, 112)"],
        "pressure": ["31055", "Давление", "мм.рт.ст", "rgb(115, 0, 173)"],
        "light": ["34887", "Освещенность", "Лк", "rgb(255, 127, 0)"],
        "geiger": ["12059", "Радиационный фон", "мкР/час", "rgb(29, 255, 0)"],
        "wind": ["49217", "Скорость ветра", "м/с", "rgb(0, 99, 0)"],
        "dewPoint": ["50912", "Температура точки росы", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"],
        "tempEff": ["5922", "Эффективная температура", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"],
        "dDewPoint": ["96883", "Дифицит точки росы", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"]
    });

    var idToSensor = new Object({
        "31053": ["temp", "Температура", "", "rgb(255, 50, 50)"],
        "31054": ["hum", "Влажность", "%", "rgb(0, 28, 112)"],
        "31055": ["pressure", "Давление", "мм.рт.ст", "rgb(115, 0, 173)"],
        "34887": ["light", "Освещенность", "Лк", "rgb(255, 127, 0)"],
        "12059": ["geiger", "Радиационный фон", "мкР/час", "rgb(29, 255, 0)"],
        "49217": ["wind", "Скорость ветра", "м/с", "rgb(0, 99, 0)"],
        "50912": ["dewPoint", "Температура точки росы", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"],
        "5922": ["tempEff", "Эффективная температура", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"],
        "96883": ["dDewPoint", "Дифицит точки росы", String.fromCharCode(176) + "C", "rgb(51, 51, 51)"]
    });
function dewPoint(t, h) {
    a = 17.27;
    b = 237.7;
    func = a*t/(b+t) + Math.log(0.01*h);
    result = (b*func)/(a-func);
    return result.toPrecision(3)
}

function tempEff(t, h, v) {
    var e = 0.01*h*6.105*Math.exp((17.27*t)/(237.7+t));
    var Q=0;
    result = t - 0.348*e - 0.7*v + 0.7*Q/(v + 10) - 4.25   ; 
    return result.toPrecision(3)
}

function cloudHeight(t, dp) {
    return Math.round(208*Math.abs(t - dp))
}

function tableLoad(){
        /*----------------текущие данные и заполнение таблицы----------------------*/
    var dataForTable = [];
    var request_now = "https://narodmon.ru/api/sensorsOnDevice?id=10649&trends=1&uuid=b2d13f963977506b151a86351ff3d5ec&api_key=3MraBhgVgmG9n&lang=ru";
    var req_now = new XMLHttpRequest();
    req_now.open("GET", request_now, true);
    req_now.onreadystatechange = function () {
    if (req_now.readyState == 4 && req_now.status === 200) {
        jsonDecode = JSON.parse(req_now.responseText); 
        //console.log(jsonDecode);
        var i; 
        for (i=0; i<jsonDecode.sensors.length; i++){
                console.log(jsonDecode.sensors[i].name, jsonDecode.sensors[i].value, jsonDecode.sensors[i].trend, jsonDecode.sensors[i].id);
                if (jsonDecode.sensors[i].id == "31055"){
                    var forecast;
                    tr = jsonDecode.sensors[i].trend;
                    document.getElementById("pressure_trend").textContent = "   " + tr + " мм/час";

                    if (tr > 0.25){
                        forecast = 'Quickly rising pressure, not stable';
                        document.getElementById("pickerImg").innerHTML = '<img src=img/icons/chancestorm.png>';
                    }
                    if (tr <= 0.25 && tr > 0.05){
                        forecast = 'Slowly rising pressure, stable good weather';
                        document.getElementById("pickerImg").innerHTML = '<img src=img/icons/clear.png>';
                    }
                    if (tr <= 0.05 && tr > -0.05){
                        forecast = 'Stable weather';
                        document.getElementById("pickerImg").innerHTML = '<img src=img/icons/mostlysunny.png>';
                    }
                    if (tr <= -0.05 && tr > -0.25){
                        forecast = 'Slowly falling trend, rainy';
                        document.getElementById("pickerImg").innerHTML = '<img src=img/icons/rain01.png>';
                    }
                    if (tr <= -0.25){
                        forecast = 'Quickly falling trend, thundersgorm';
                        document.getElementById("pickerImg").innerHTML = '<img src=img/icons/thunderstorms02.png>';
                    }
                }
                document.getElementById(idToSensor[jsonDecode.sensors[i].id][0]).textContent = String(jsonDecode.sensors[i].value) + " " + idToSensor[jsonDecode.sensors[i].id][2];
            }
            
            //document.getElementById("tempEff").textContent = String(tempEff(jsonDecode.sensors[0].value, jsonDecode.sensors[1].value, jsonDecode.sensors[5].value)) + " " + sensorToId["temp"][2];
            //document.getElementById("dewPoint").textContent = String(dewPoint(jsonDecode.sensors[0].value, jsonDecode.sensors[1].value)) + " " + sensorToId["temp"][2];
            document.getElementById("cloudHeight").textContent = String(cloudHeight(jsonDecode.sensors[0].value, dewPoint(jsonDecode.sensors[0].value, jsonDecode.sensors[1].value))) + " м";
        }
    }
    req_now.send();
}


function dataLoad(sensor_period = "temp_day", cFunction)
{  
    console.log(sensor_period);
    var sensor = sensor_period.split("_")[0];
    var period = sensor_period.split("_")[1];  
    sensor_id = sensorToId[sensor][0];
    /* HTTP GET to https://narodmon.ru*/
    /*----------------Запрос данных с сервера narodmon.ru----------------------*/
    /*----------------данные за период и построение графика--------------------*/
    var request_hist = "https://narodmon.ru/api/sensorsHistory?id=" + sensor_id + "&period=" + period + "&offset=0&uuid=9360bc15113a0e83a569e4c4dc33f496&api_key=3MraBhgVgmG9n";
    var req_hist = new XMLHttpRequest(); 
    req_hist.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        //вызываем функцию-обработчик, которая получит данные
        cFunction(this, sensor_period);

    };
    /*------------- конец onreadystatechange ---------------------------------------*/
    }
    req_hist.open("GET", request_hist, true);
    req_hist.send(null);    
}

/*
myFunction1 принимает данные после GET запроса
сериализует их и сохраняет в локальное хранилище
для последующего использования
*/
function myFunction1(r, sensor_period) {
    jsonDecode = JSON.parse(r.responseText);
    var serialJSON = JSON.stringify(jsonDecode);
    localStorage.setItem(sensor_period, serialJSON);

    // функция, построение графиков
    if (sensor_period == "temp_day") 
    {
        dataLoad("pressure_day", myFunction1);
    } else 
    {
        myFunction2(sensor_period);
    }
}

function myFunction2(sensor_period) {

    var sensor = sensor_period.split("_")[0];
    var period = sensor_period.split("_")[1]; 

    var dataForChart = [];
    var maxValue = -100000;
    var minValue = 100000;
 
    /*
     читаем основные данные из локального хранилища
     парсим JSON и сохраняем в локальную переменную
     */
    var jsonDecode = JSON.parse(localStorage.getItem(sensor_period));
        //console.log(jsonDecode.data.length);
        var i; 
        for (i=0; i<jsonDecode.data.length; i++){
                if (jsonDecode.data[i].value < minValue){
                    minValue = jsonDecode.data[i].value;
                }
                if (jsonDecode.data[i].value > maxValue){
                    maxValue = jsonDecode.data[i].value;
                }
                dataForChart.push({x: new Date(jsonDecode.data[i].time * 1000), y: jsonDecode.data[i].value});
            }
    /*
     читаем дополнительные данные из локального хранилища
     парсим JSON и сохраняем в локальную переменную
     */
    var dataForChart_add = [];
    var maxValue_add = -100000;
    var minValue_add = 100000;
    var jsonDecode_add;
    var sensor_add = "temp";

    jsonDecode_add = JSON.parse(localStorage.getItem("temp_day"));

    if (jsonDecode_add != null) 
    {
        i = 0;
        for (i=0; i<jsonDecode_add.data.length; i++){
                if (jsonDecode_add.data[i].value < minValue_add){
                    minValue_add = jsonDecode_add.data[i].value;
                }
                if (jsonDecode_add.data[i].value > maxValue_add){
                    maxValue_add = jsonDecode_add.data[i].value;
                }
                dataForChart_add.push({x: new Date(jsonDecode_add.data[i].time * 1000), y: jsonDecode_add.data[i].value});
            }
        } else
        {
            dataForChart_add  = null;
        }
        
        /*---------------------Построение графика------------------------------------*/
                var d = new Object({"data": dataForChart, "min": minValue, "max": maxValue, "titleY": sensorToId[sensor][2], "period": period, "titleLegend": sensorToId[sensor][1], "graphColor": sensorToId[sensor][3]});;
                var d_add = new Object({"data": dataForChart_add, "min": minValue_add, "max": maxValue_add, "titleY": sensorToId[sensor_add][2], "period": period, "titleLegend": sensorToId[sensor_add][1], "graphColor": sensorToId[sensor_add][3]});;

                console.log(d_add);

                var axisXTitle = new Object({
                "day":["час", "HH", "hour", "Суточный график"],
                "month":["день", "D MMM", "day", "Месячный график"],
                "year":["месяц", "MMM", "month", "Годовой график"]})

              var chart = new CanvasJS.Chart("chartContainer",
              {
                zoomEnabled: true,
                zoomType: "x",
               title:{
                text: ""//axisXTitle[d.period][3]
                },
                legend: {
                   horizontalAlign: "center", // left, center ,right 
                   verticalAlign: "top",  // top, center, bottom
                 },
                axisX:{
                    title:  "",
                    gridColor: "rgba(110, 110, 110, 0.15)",
                    gridThickness: 1,        
                    valueFormatString: axisXTitle[d.period][1],
                    interval: 1,
                    intervalType: axisXTitle[d.period][2],
                    labelFontSize: 16,
                    labelAngle: -45,
                    labelFontColor: "rgb(110, 110, 110)"
                },
                /*
                    дополнительные данные
                    располагаем на основной оси Y
                */
                axisY:{
                    title: "",
                    gridColor: "rgba(110, 110, 110, 0.15)",
                    gridThickness: 1,        
                    labelAngle: 00,
                    labelFontColor: "rgb(110, 110, 110)",
                    minimum: d_add.min,
                    maximum: d_add.max,
                   },
                axisY2:{
                    title: "",
                    gridColor: "rgba(110, 110, 110, 0.15)",
                    gridThickness: 1,        
                    labelAngle: 00,
                    labelFontColor: "rgb(110, 110, 110)",
                    minimum: d.min,
                    maximum: d.max,
                   },
                 data: [{        
                  type: "spline",
                  toolTipContent: "{y} " + d.titleY,
                  showInLegend: true,
                  axisYType: "secondary",
                  legendText: d.titleLegend, 
                  dataPoints: d.data,
                  color: d.graphColor
                },
                {        
                  type: "spline",
                  toolTipContent: "{y} " + d_add.titleY,
                  showInLegend: true,
                  axisYType: "primary",
                  legendText: d_add.titleLegend, 
                  dataPoints: d_add.data,
                  color: d_add.graphColor
                }]
              });

              chart.render();
        /*---------------------------Конец построения графика-----------------------*/
        //очищаем локальное хранилище
        localStorage.clear();
} 