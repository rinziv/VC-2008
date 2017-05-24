function buildingBitmap(){
	var svg;
	
	
	function me(selection){
		
		
		
		var gr = selection.selectAll("g.row")
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
	
	return me;
}
