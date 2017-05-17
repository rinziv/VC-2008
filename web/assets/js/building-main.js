
function BuildingApp(){
	var svg;
	var width = 910;
	var height = 610;
	
	function me(selection){
		console.log("BuildingApp");
		
		d3.text("assets/data/building_map.txt",function(error, map){
			if(error) console.log(error);
	
			var aMap = map.split('\n') // split by line
				.map(function(d){ 
					return d.trim().split(' ') // split by space
					.map(function(e){return +e}) // convert character to number
				});	
			var building = buildingBitmap();
	
			svg = d3.select("#building")
				.append("svg")
				.attr("width", width)
			.attr("height", height);
			
			svg.append("g")
				.classed("buildingMap", true)
				.datum(aMap)
				.call(building);
	
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
			
			var trajectories = Trajectories();
			svg.append("g")
				.classed("trajs",true)
				.datum(trs)
			.call(trajectories);
		}
	)
		
		
	}
	
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
	
	
	return me;
}



var buildingApp = BuildingApp();
d3.select("#main")
.call(buildingApp);