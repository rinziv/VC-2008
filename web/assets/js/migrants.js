

function app(){
	
	var svg;
	var map = MapWithLayers();
	var migrants;
	var cf; // crossfilter instance 
	var dYear; // dimension for Year 
	var dRecordType; // dimension for RecordType 
	var dMonth; // dimension for Month 
	var dVesselType; // dimension for VesselType 
	var chartDescriptors; 
	
	var colorByReport = d3.scale.ordinal() 
		.domain(["Interdiction","Landing"]) 
		.range(["red","green"]);
	
	// dispacther for hte events
	var dispatch = d3.dispatch("changeYear", "changeRecordType");
	
	function me(selection){
		d3.json("assets/data/migrant.json",function(error, json){
			if(error) throw error;
			console.log("raw data", json);
			migrants = json.map(function(d,i){
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
	  // initialize Crossfilter   
	        cf = crossfilter(migrants); 
	        dYear = cf.dimension(function(d){return d.year}); 
	        dRecordType = cf.dimension(function(d){return d.RecordType}); 
	        dVesselType = cf.dimension(function(d){return d.VesselType}); 
       
	        // dRecordType.filterAll(); 
	        console.log("years", dYear.group().reduceCount().all()); 
	        console.log("recordType", dRecordType.group().reduceCount().all()); 
	        console.log("vesselType", dVesselType.group().reduceCount().all()); 
      	  	
			createCharts();
			createCounters();
			
	        // select count(*) from migrants where VesselType=="Rustic” 
	        // dVesselType.filter("Go Fast"); 
	        console.log("num reports (Go Fast)",cf.groupAll().reduceCount()); 
	        // select sum(Passengers) from migrants where VesselType=="Rustic” 
	        console.log("num passengers (Go Fast)", cf.groupAll().reduceSum(function(d){return d.Passengers}).value()) 
	        // select sum(NumDeaths) from migrants where VesselType=="Rustic” 
	        console.log("num deaths (Go Fast)", cf.groupAll().reduceSum(function(d){return d.NumDeaths})) 
	        // select VesselType, count(*) from migrants group by VesselType 
	        var countVesselType = dVesselType.group().reduceCount(); 
	        console.log(countVesselType.all()); 
       
	        // how many report? 
	        // select count(*) from migrants 
	        console.log("num reports", cf.groupAll().reduceCount().value()); 
 
	        // select sum(Passengers) from migrants 
	        console.log("num passengers", cf.groupAll().reduceSum(function(d){return d.Passengers}).value()) 
 
	        // select sum(NumDeaths) from migrants 
	        console.log("num deaths", cf.groupAll().reduceSum(function(d){return d.NumDeaths}).value()) 
       
			
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
			
			gReports.selectAll("path")
				.attr("opacity", 0.6	)
				.attr("fill", function(d){return colorByReport(d.properties.RecordType)});
				
			createToolbar(migrants);
			registerEventListeners();
		})
	}
	
	function createCounters(){
		var counterDescriptor = [
			{
				measure: "# Records",
				cfAggregator: cf.groupAll().reduceCount(),
				classed: "counter-num-records"
			},{
				measure: "# Passengers",
				cfAggregator: cf.groupAll().reduceSum(function(d){return d.Passengers}),
				classed: "counter-Passengers"
			},{
				measure: "# Deaths",
				cfAggregator: cf.groupAll().reduceSum(function(d){return d.NumDeaths}),
				classed: "counter-num-records"
			}
		]
		
		
		counterDescriptor.forEach(function(d){
			var counter = Counter().measure(d.measure);
			d3.select("#counters")
				.append("div")
				.classed(d.classed, true)
				.classed("col-xs-12", true)
				.datum(d.cfAggregator.value())
			.call(counter);
		})
		
		
		
		
	}
	
	function createCharts(){
		chartDescriptors = [
			{
				dimension:"Vessel Type",
				cfDimension: dVesselType,
				classed: "chart-VesselType"
			},{
				dimension:"Year",
				cfDimension: dYear,
				classed: "chart-Year"
			},{
				dimension:"Record Type",
				cfDimension: dRecordType,
				classed: "chart-RecordType"
			},
		];
		
		
		chartDescriptors.forEach(function(d){
			var chart = CrossFilterChart().dimension(d.dimension);
			d.chart = chart;
			d3.select("#charts")
				.append("div")
				.classed(d.classed, true)
				.classed("col-md-4", true)
				.datum(d.cfDimension.group().reduceCount().all())
			.call(chart);
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
		
		
		
		dispatch.on("changeYear.charts", function(newYear){
			dYear.filter(newYear);
			chartDescriptors.forEach(function(d){
				d.chart.refresh(d.cfDimension.group().reduceCount().all());
			})
		})
		
		dispatch.on("changeYear.map", function(newYear){
			refreshMap(dYear);
			

		});
		
		
		dispatch.on("changeRecordType.buttons", function(newRecordType){
			console.log("changeRecordType.buttons");
			d3.select("#toolbar").select("div.recordtype-group")
			.selectAll("button")
			.classed("active",function(d){return d==newRecordType})
			.classed("btn-primary",function(d){return d==newRecordType});
		});
		
		dispatch.on("changeRecordType.charts", function(newRecordType){
			if(newRecordType=="All")
				dRecordType.filterAll()
			else
				dRecordType.filter(newRecordType);
			chartDescriptors.forEach(function(d){
				d.chart.refresh(d.cfDimension.group().reduceCount().all());
			})
		})
		
		dispatch.on("changeRecordType.map", function(newRecordType){
			refreshMap(dRecordType);
		});
	}
	
	function refreshMap(cfDimension){
		var fcReports = {
			type:"FeatureCollection",
			features: cfDimension.top(Infinity)
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
		
		svg.select("g.reports")
			.datum(fcReports)
		.call(map);
		
		svg.select("g.reports").selectAll("path")
			.attr("opacity", 0.6	)
			.attr("fill", function(d){return colorByReport(d.properties.RecordType)});
	}
	
	
	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);