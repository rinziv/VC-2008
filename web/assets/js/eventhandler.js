var dispatch = d3.dispatch("intervalSelection","togglePersonSelection", "updatedPersonSelection");


dispatch.on("intervalSelection", function(d){
	// console.log("intervalSelection", d);
	if(d[0]!=d[1])
		buildingApp.trajectories().timeExtent(d);
})


dispatch.on("togglePersonSelection", function(d){
	var selectedPersons = buildingApp.personList.selectedPersons();
	if(selectedPersons[d.id]){
		delete selectedPersons[d.id]
	}else
		selectedPersons[d.id] = d;
	
	dispatch.updatedPersonSelection(d, selectedPersons);
})




dispatch.on("updatedPersonSelection.list", function(d, selectedPersons){
	
	d3.select("#persons")
		.selectAll(".list-group-item")
		.classed("active",function(l){return selectedPersons[l.id]});
})

dispatch.on("updatedPersonSelection.trajs", function(d, selectedPersons){
	console.log("togglePersonSelection", selectedPersons);
	d3.select("#building")
		.select("svg g.trajs")
		.selectAll("path")
		// .attr("stroke", "#f00")
		.classed("active", function(l){return selectedPersons[l.person]})
})