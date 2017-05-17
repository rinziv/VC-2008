function buildingBitmap(){
	var width = 910;
	var height = 610;
	var svg;
	
	
	function me(selection){
		svg = selection
			.append("svg")
			.attr("width", width)
		.attr("height", height);
		
		
		var gr = svg.selectAll("g.row")
			.data(selection.datum())
			.enter()
			.append("g")
			.classed("row",true)
		.attr("transform",function(d,i){return "translate(0,"+(i*10)+")"});
		
		var wallColor = d3.scale.ordinal()
			.domain([0,1])
		.range(["white", "lightgray"]);
		
		gr.selectAll("rect")
			.data(function(d){return d})
			.enter()
			.append("rect")
			.attr("x",function(d,i){return i*10})
			.attr("width",10)
			.attr("height",10)
			.attr("fill",function(d){return wallColor(d)});
	}
	
	// setter and getter
	me.height = function(_){
		if(!arguments.length) return height;
		height = _;
		
		return me;
	}
	
	me.width = function(_){
		if(!arguments.length) return width;
		width = _;
		
		return me;
	}
	
	return me;
}
