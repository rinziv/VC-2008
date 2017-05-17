

function TimelineBrush(){
	var width = 960;
	var height = 200;
	
	var x = d3.scale.linear()
		.domain([0,800])
	.range([0,width]);
	
	var brush = d3.svg.brush()
		.x(x)
		.extent([10,100])
		.on("brush", brushed);
	
	function me(selection){
		
		var svg = selection.append("svg")
			.attr({width: width+40, height: height+40})
		.append("g");
		
		svg.append("rect")
			.attr({width: width, height: height, fill:"#ddd"});
		
		svg.append("g")
			.classed("x grid", true)
			.attr("transform", "translate(0,"+height+")")
			.call(d3.svg.axis()
				.scale(x)
				.orient("bottom")
			);
			
		var gBrush = svg.append("g")
			.attr("class", "brush")
		.call(brush);
	
		gBrush.selectAll("rect")
		.attr("height", height);
		
	}
	
	function brushed(){
		var extent0 = brush.extent(),
			extent1;

		extent1 = extent0.map(function(d){return Math.round(d)});
		
		console.log(extent1);
		d3.select(this).call(brush.extent(extent1));
	}

	return me;
}