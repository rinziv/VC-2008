
function Counter(){
	
	var measure = "Measure";
	var h1s;
		
	function me(selection){
		var h3s = selection.selectAll("h3.measure")
		.data([selection.datum()]); // pass an array of data, even if a single element
		
		h3s.enter()
			.append("h3")
		.classed("measure",true);
		
		h3s.text(measure);
		
		
		h1s = selection.selectAll("h1.value")
		.data([selection.datum()]);
		
		h1s.enter()
			.append("h1")
		.classed("value", true);
		
		h1s.text(function(d){return d});
	}
	
	me.refresh = function(data){
		h1s.data([data])
		.text(function(d){return d});
		
		return me;
	}
	
	me.measure = function(_){
		if(!arguments.length) return measure;
		measure = _;
		
		return me;
	}
	
	return me;
}