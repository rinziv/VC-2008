

function Trajectories(){
	var x = d3.scale.linear()
		.domain([0,91])
		.range([5,915]);
	
	var y = d3.scale.linear()
		.domain([0,60])
		.range([605,5]);
	
	var path = d3.svg.line()
		.x(function(d){return x(d.x)})
		.y(function(d){return y(d.y)})
	.interpolate("basis");
		
	
	function me(selection){
		// draw all trajectories
		
		var paths = selection.selectAll("path")
		.data(selection.datum(), function(d){return d.person});
		
		paths
			.enter()
			.append("path")
			.attr("stroke-width",1)
			.attr("stroke", "black")
			.attr("fill","none")
		.attr("opacity",0.4);
		
		paths.attr("d", function(d){
			return path(d.values);
			});
	}
	
	return me;
}