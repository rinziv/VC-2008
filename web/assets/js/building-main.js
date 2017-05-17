
function BuildingApp(){
	
	function me(selection){
		console.log("BuildingApp");
		

		
		
	}
	
	return me;
}



var buildingApp = BuildingApp();
d3.select("#main")
.call(buildingApp);