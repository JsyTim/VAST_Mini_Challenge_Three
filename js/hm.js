var filelist = [];
for ( i = 1; i < 20; i ++ )
{
	var filename = "data/aggDataHeatmap/Region" + i + ".csv";
	filelist.push(d3.csv(filename));
}

//Read the data
Promise.all(filelist).then(files => {
	var index = 1;
	var alldata = [];
	for (i = 0; i < files.length; i ++ ){
		files[i].forEach(d => {
			d.Timestamp = parse(d.Timestamp);
			d.Value = +d.Value;
		})
		alldata.push(files[i]);
	}
	console.log(alldata[index-1]);
	draw_hm(alldata[index-1]);
});

function draw_hm(data) {

  var sensorList = Object.keys(data["Sensor-id"]).slice(1);
  var mobileList = sensorList.filter(d => d.split("-")[0] === "mobile")
                             .sort((a,b) => {
                               var x = +a.split("-")[1],
                                   y = +b.split("-")[1];
                               return(x < y)? -1:1;
                             });
  var staticList = sensorList.filter(d => d.split("-")[0] === "static");
  if (staticList.length != 0 ){
    staticList.sort((a,b) => {
                var x = +a.split("-")[1],
                    y = +b.split("-")[1];
                return(x < y)? -1:1;
    });

  var sensors = mobileList.concat(staticList);
}
