

d3.text("assets/data/building_map.txt",function(error, map){
	if(error) console.log(error);
	
	var aMap = map.split('\n').map(function(d){ return d.trim().split(' ').map(function(e){return +e})});
	
	
	console.log(aMap);
	
	var building = buildingBitmap();
	
	d3.select("#building").call(building);
	
	building.data(aMap);
	
});


d3.tsv("assets/data/rfid_pathway.txt", 
	function(row){
		return {
			person: +row.Person,
			time: +row.Time,
			x: +row.xcor,
			y: +row.ycor
		}
	},
	function(error, paths){
		if(error) console.log(error);
	
		var trajs = d3.nest()
			.key(function(d){return d.person})
		.entries(paths);
		
		var trs = d3.values(trajs).map(function(d){return {
			person: +d.key,
			values: d.values.map(function(p){return {x:p.x, y:p.y}})
		}})
	
		console.log("trajs",trajs);
		console.log("trs",trs);
		
		
		// draw all trajectories
		var x = d3.scale.linear()
		.domain([0,91])
		.range([5,915]);
		
		var y = d3.scale.linear()
		.domain([0,60])
		.range([605,5]);
		
		
		var path = d3.svg.line()
			.x(function(d){return x(d.x)})
			.y(function(d){return y(d.y)})
		.interpolate("linear");
		
		
		var g = d3.select('#building')
		.select('svg')
		.append("g")
		.classed("trajs",true);
		
		g.selectAll("path")
			.data(trs.map(function(d){return d.values}))
			.enter()
			.append("path")
			.attr("stroke-width",1)
			.attr("stroke", "black")
			.attr("fill","none")
			.attr("opacity",0.4)
		.attr("d", path);
	}
)




function buildingBitmap(){
	var width = 910;
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