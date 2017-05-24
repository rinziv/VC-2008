var dispatch = d3.dispatch("intervalSelection", "updatedPersonSelection");


dispatch.on("intervalSelection", function(d){
	// console.log("intervalSelection", d);
	if(d[0]!=d[1])
		buildingApp.trajectories().timeExtent(d);
	
	buildingApp.statusbar.refresh();
})




// dispatch.on("unselectAllPerson", function(){
//
// })


dispatch.on("updatedPersonSelection.list", function(d, selectedPersons){
	
	d3.select("#persons")
		.selectAll(".list-group-item")
		.classed("active",function(l){return selectedPersons[l.id]});
		
	buildingApp.statusbar.refresh();
})

dispatch.on("updatedPersonSelection.trajs", function(d, selectedPersons){
	console.log("updatedPersonSelection", selectedPersons);
	d3.select("#building")
		.select("svg g.trajs")
		.selectAll("path")
		// .attr("stroke", "#f00")
		.classed("active", function(l){return selectedPersons[l.person]})
})