

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
				features: migrants.map(function(d,i){  // for each entry in Museums dictionary
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
			
			
			var extentX = d3.extent(migrants, function(d){return d.EncounterCoords[0]});
			var extentY = d3.extent(migrants, function(d){return d.EncounterCoords[1]});
			console.log("extentX", extentX);
			console.log("extentY", extentY);
			var centroid = [(extentX[0]+extentX[1])/2,(extentY[0]+extentY[1])/2];
			console.log("centroid", centroid);
			map.center(centroid)
				.scale(2500);
			
			svg = selection.append("svg")
			.attr({width:"100%", height:600});
			
			var gWorld = svg.append("g")
			.attr("class","mapWorld");
			
			d3.json("assets/data/world.geojson", function(error, world){
				console.log("world", world)
				
				gWorld.datum(world)
				.call(map);
			})
			
			
			
			svg.append("g")
				.attr("class","reports		")
				.datum(fcReports)
			.call(map);
		})
	}
	
	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);