
function BuildingApp(){
	
	function me(selection){
		console.log("BuildingApp");
		
		d3.text("assets/data/building_map.txt",function(error, map){
			if(error) console.log(error);
	
			var aMap = map.split('\n') // split by line
				.map(function(d){ 
					return d.trim().split(' ') // split by space
					.map(function(e){return +e}) // convert character to number
				});	
			var building = buildingBitmap();
	
			d3.select("#building")
			.datum(aMap)
			.call(building);
	
		});
		
		
	}
	
	return me;
}



var buildingApp = BuildingApp();
d3.select("#main")
.call(buildingApp);