
function StatusBar(){
	var htime;
	var hpersons;
	
	function me(selection){
		htime = selection.append("div")
			.classed("time-stat", true)
			.classed("col-xs-4", true)
		.append("h4");
		htime.append("span")
		.classed("glyphicon glyphicon-resize-horizontal",true);
		htime.append("span")
		.classed("interval", true)
		.text("time interval");
		
		
		hpersons = selection.append("div")
			.classed("persons-selected", true)
			.classed("col-xs-4", true)
		.append("h4");
		hpersons.append("span")
		.classed("glyphicon glyphicon-user",true);
		hpersons.append("span")
		.classed("num-persons", true)
		.text("selected users");
		
		
		
		me.refresh();
	}
	
	
	
	me.refresh = function(){
		if(buildingApp.timeline()){
			var ti = buildingApp.timeline().timeInterval();
			htime.select("span.interval")
			.text("["+ti.join(',')+"]");
		}
		
		if(hpersons){
			var numSelected = d3.keys(buildingApp.personList.selectedPersons()).length;
			hpersons.select("span.num-persons")
			.text(numSelected + " selected");
		}
	}
	
	
	return me;
}