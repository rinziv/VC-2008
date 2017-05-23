

function Trajectories(){
	var container;
	
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
	
	var timeExtent = [0,100];
	
	function me(selection){
		// draw all trajectories
		container = selection;
		var paths = container.selectAll("path")
		.data(container.datum(), function(d){return d.person});
		
		paths
			.enter()
			.append("path")
			.attr("stroke-width",1)
			.attr("stroke", "black")
			.attr("fill","none")
		.attr("opacity",0.4);
		
		paths.attr("d", function(d){
			return path(d.values.slice(timeExtent[0],timeExtent[1]));
			});
	}
	
	me.timeExtent = function(_){
		if(!arguments.length) return timeExtent;
		timeExtent = _;
		
		var paths = container.selectAll("path")
		.data(container.datum(), function(d){return d.person});
		paths.attr("d", function(d){
			return path(d.values.slice(timeExtent[0],timeExtent[1]));
			});
	}
	
	return me;
}