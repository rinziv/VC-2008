

d3.text("assets/data/building_map.txt",function(error, map){
	if(error) console.log(error);
	
	var aMap = map.split('\n').map(function(d){ return d.trim().split(' ').map(function(e){return +e})});	
	var building = buildingBitmap();
	
	d3.select("#building").call(building);
	building.data(aMap);
	
});

d3.tsv("assets/data/rfid_assignments.txt",
function(row){
	var entries = d3.values(row);

	if(entries[0].length > 0)
		return {id: +entries[0],
			person: entries[1]}
},
function(error,ids){
	if(error) console.log(error);
	
	console.log("ids",ids);
	
	var rlist = rfidList();
	d3.select("#persons")
		.datum(ids)
	.call(rlist);

	
	
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
		
		var trs = d3.values(trajs).map(function(d){
			var pl = d.values.map(function(p,i){
				if(i==0) return 0;
				return euclideanDistance(p, d.values[i-1])
			});
			return {
			person: +d.key,
			values: d.values.map(function(p){return {x:p.x, y:p.y}}),
			path_length: pl.reduce(function(a,b){return a+b}, 0),
			delta_s: pl
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
		.interpolate("basis");
		
		
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
		
		
		console.log(distances(trs[10],trs[50]));
	}
)


function euclideanDistance(a,b){
	return Math.sqrt(Math.pow(a.x -b.x,2) + Math.pow(a.y - b.y,2));
}


function distances(p1,p2){
	console.log("p1",p1);
	console.log("p2",p2);
	return p1.values.map(function(d,i){
		return [i, euclideanDistance(d, p2.values[i])]
		});
}


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


function rfidList(){
	
	function me(selection){
		console.log(selection);
		selection.append("ul")
			.selectAll("li")
			.data(function(d){return d})
			.enter()
			.append("li")
			.text(function(d){return d.id+": " + d.person})
			.on("click",function(d){console.log(d)})
	}
	
	return me;
	
}

