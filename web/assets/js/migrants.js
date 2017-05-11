

function app(){
	
	var svg;
	var map = MapWithLayers();
	
	// dispacther for hte events
	var dispatch = d3.dispatch("changeYear", "changeRecordType");
	
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
		
				// if(d.EncounterCoords)
					r['EncounterCoords'] = [+d.EncounterCoords[0],+d.EncounterCoords[1]];
				// if(d.LaunchCoords)
					r['LaunchCoords'] = [+d.LaunchCoords[0],+d.LaunchCoords[1]];
		
				return r;
			})
			
			console.log("migrants", migrants);
			console.log(migrants.length);
			
			// transform reports to a FeatureCollection
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
				.scale(5000);
							
			svg = selection.append("svg")
			.attr({width:"100%", height:1000});
			
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
			gReports.selectAll("path")
				.attr("fill", function(d){return colorYear(d.properties.year)});
				
			createToolbar(migrants);
			registerEventListeners();
		})
	}
	
	
	function createToolbar(migrants){
		var toolbar = d3.select("#toolbar");
		
		
		// create a selector for Years
		toolbar.append("label")
		.attr("style","margin-right:5px")
		.text("Years:");
		
		var tbYear = toolbar.append("div")
			.attr({id:"mode-group", class:"btn-group year-group", "data-toggle":"buttons",style:"margin-right:20px; margin-bottom: 10px" })
			.selectAll("button")
			.data([2005,2006,2007])
			.enter()
			.append("button")
			.attr({class:"btn btn-group btn-default", role:"group"})
			// .append("input")
// 			.attr({type:"radio", name:"mode", id:"option1"})
			.text(function(d){return d})
			.on("click", function(d){
				dispatch.changeYear(d);
				console.log("click year", d);
			});
		
		toolbar.append("label")
			.attr("style","margin-right:5px")
		.text("RecordType:");
				
		var tbRecordType = toolbar.append("div")
			.attr({id:"mode-group", class:"btn-group recordtype-group", "data-toggle":"buttons",style:"margin-right:20px; margin-bottom: 10px"  })
			.selectAll("button")
			.data(["All","Interdiction","Landing"])
			.enter()
			.append("button")
			.attr({class:"btn btn-group btn-default", role:"group"})
			// .append("input")
// 			.attr({type:"radio", name:"mode", id:"option1"})
		.text(function(d){return d})
		.on("click", function(d){
			dispatch.changeRecordType(d);
			console.log("click type", d)
		});
	}
	
	function registerEventListeners(){
		var colorReport = d3.scale.ordinal()
			.domain(["Interdiction","Landing"])
		.range(["red","green"]);
		
		dispatch.on("changeYear.buttons", function(newYear){
			console.log("changeYear.buttons");
			d3.select("#toolbar").select("div.year-group")
			.selectAll("button")
			.classed("active",function(d){return d==newYear})
			.classed("btn-primary",function(d){return d==newYear});
		});
		
		dispatch.on("changeYear.map", function(newYear){
			svg.select("g.reports")
				.selectAll("path")
			.transition().duration(1500)
				.attr("opacity",0.0)
				.filter(function(d){return (newYear<0)||(d.properties.year==newYear)})
			.attr("opacity",0.6)
			.attr("fill",function(d){return colorReport(d.properties.RecordType)});
		});
		
		
		dispatch.on("changeRecordType.buttons", function(newRecordType){
			console.log("changeRecordType.buttons");
			d3.select("#toolbar").select("div.recordtype-group")
			.selectAll("button")
			.classed("active",function(d){return d==newRecordType})
			.classed("btn-primary",function(d){return d==newRecordType});
		});
		
		dispatch.on("changeRecordType.map", function(newRecordType){
			dispatch.changeYear(-1);
			svg.select("g.reports")
				.selectAll("path")
			.transition().duration(1500)
			.attr("opacity",0.0)
				.filter(function(d){
					return (d.properties.RecordType==newRecordType)
				})
			.attr("opacity",0.6);
			
		});
	}
	
	
	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);