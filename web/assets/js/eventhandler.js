var dispatch = d3.dispatch("intervalSelection");


dispatch.on("intervalSelection", function(d){
	console.log("intervalSelection", d);
	buildingApp.trajectories().timeExtent(d);
})