

d3.text("assets/data/building_map.txt",function(error, map){
	if(error) console.log(error);
	
	var aMap = map.split('\n').map(function(d){ return d.split(' ').map(function(e){return +e})});
	
	
	console.log(aMap);
	
	var building = buildingBitmap();
	
	d3.select("#building").call(building);
	
	building.data(aMap);
	
})




function buildingBitmap(){
	var width = 920;
	var height = 610;
	var svg;
	
	
	function me(selection){
		svg = selection
			.append("svg")
			.attr("width", width)
		.attr("height", height);
	}
	
	me.data = function(_){
		if(!arguments.length) return data;
		
		// data is expected as an array of array
		//first dimension: create the rows
		var gr = svg.selectAll("g.row")
			.data(_)
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