

function app(){
	
	var svg;
	var map = MapWithLayers();
	
	function me(selection){
		d3.json("assets/data/migrant.json",function(error, json){
			if(error) throw error;
			console.log("raw data", json);
			var migrants = json.map(function(d,i){
				var r =  {
					EncounterDate: d.EncounterDate,
					NumDeaths: +d.NumDeaths,
					Passengers: +d.Passengers,
					RecordNotes: d.RecordNotes,
					RecordType: d.RecordType,
					USCG_Vessel: d.USCG_Vessel,
					VesselType: d.VesselType,
					year: +d.EncounterDate.split('-')[0]
				}
		
				if(d.EncounterCoords)
					r['EncounterCoords'] = [+d.EncounterCoords[0],+d.EncounterCoords[1]];
				if(d.LaunchCoords)
					r['LaunchCoords'] = [+d.LaunchCoords[0],+d.LaunchCoords[1]];
		
				return r;
			})
			
			console.log("migrants", migrants);
			console.log(migrants.length);
			var fcReports = {
				type:"FeatureCollection",
				features: migrants
				.map(function(d,i){  // for each entry in Museums dictionary
					if(d.EncounterCoords)
						return {
							type:"Feature",
							properties:{
								EncounterDate: d.EncounterDate,
								NumDeaths: +d.NumDeaths,
								Passengers: +d.Passengers,
								RecordNotes: d.RecordNotes,
								RecordType: d.RecordType,
								USCG_Vessel: d.USCG_Vessel,
								VesselType: d.VesselType,
								year: d.year
							},
							geometry:{
								type:"Point",
								coordinates: d.EncounterCoords
							}
						}
				})
			};
			
			
			// dynamic computation of centroid
			var extentX = d3.extent(migrants, function(d){return d.EncounterCoords[0]});
			var extentY = d3.extent(migrants, function(d){return d.EncounterCoords[1]});
			console.log("extentX", extentX);
			console.log("extentY", extentY);
			var centroid = [(extentX[0]+extentX[1])/2,(extentY[0]+extentY[1])/2];
			console.log("centroid", centroid);
			
			map.center(centroid)
				.scale(4500);
							
			svg = selection.append("svg")
			.attr({width:"100%", height:800});
			
			var gWorld = svg.append("g")
			.attr("class","mapWorld");
			
			d3.json("assets/data/world.geojson", function(error, world){
				console.log("world", world)
				
				gWorld.datum(world)
				.call(map);
			})
			
			
			
			var gReports = svg.append("g")
				.attr("class","reports")
				.datum(fcReports)
			.call(map);
			
			// change color of points
			
			// according to year
			var colorYear = d3.scale.ordinal()
				.domain([2005,2006,2007])
				.range(colorbrewer['Dark2'][3]);
			
			
			console.log([colorYear(2005), colorYear(2006), colorYear(2007)]);
			
			gReports.selectAll("path")
			.attr("fill", function(d){return colorYear(d.properties.year)});
			
		})
	}
	
	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);