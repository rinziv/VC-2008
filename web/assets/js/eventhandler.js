var dispatch = d3.dispatch("intervalSelection");


dispatch.on("intervalSelection", function(d){
	// console.log("intervalSelection", d);
	if(d[0]!=d[1])
		buildingApp.trajectories().timeExtent(d);
})