

function TimelineBrush(){
	var width = 960;
	var height = 50;
	var extent1 = [];
	
	var x = d3.scale.linear()
		.domain([0,800])
	.range([0,width]);
	
	var brush = d3.svg.brush()
		.x(x)
		.extent([0,10])
		.on("brush", brushed);
	
	function me(selection){
		
		var svg = selection.append("svg")
			.attr({width: width+40, height: height+40})
		.append("g")
		.attr("transform","translate(20,0)");
		
		svg.append("rect")
			.attr({width: width, height: height, fill:"#ddd"});
		
		svg.append("g")
			.classed("x grid axis", true)
			.attr("transform", "translate(0,"+height+")")
			.call(d3.svg.axis()
				.scale(x)
				.orient("bottom")
			);
			
		var gBrush = svg.append("g")
			.attr("class", "brush")
		.call(brush);
	
		gBrush.selectAll("rect")
		.attr("y",1)
		.attr("height", height-1);
		
	}
	
	me.domain = function(_){
		if(!arguments.length) return x.domain();
		x.domain(_);
		
		return me;
	} 
	
	function brushed(){
		var extent0 = brush.extent();
	

		extent1 = extent0.map(function(d){return Math.round(d)});
		
		dispatch.intervalSelection(extent1);
		//console.log(extent1);
		d3.select(this).call(brush.extent(extent1));
	}
	
	me.timeInterval = function(){
		return extent1;
	}

	return me;
}