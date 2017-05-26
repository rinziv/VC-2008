

function CellPhonesApp(){
	
	var graph;
	
	function me(selection){
		console.log("CellPhones App");
		var timeFormat = d3.time.format("%Y%m%d %H%M");
		
		d3.csv("assets/data/CellPhoneCallRecords.csv", 
			function(row){
				return {
					tower_id: +row["Cell Tower"],
					ts: timeFormat.parse(row["Datetime"]),
					duration: +row["Duration(seconds)"],
					source: +row["From"],
					target: +row["To"]
				}
			},
			function(error, calls){
				if (error) console.log(error);
			
				console.log("calls", calls);
				console.log("time extent", d3.extent(calls, function(d){return d.ts}));
				
				var graph = d3.nest()
					.key(function(d){return d.source})
					.key(function(d){return d.target})
				.entries(calls);
				
				nodes = graph.map(function(n){return {id:+n.key, weight: n.values.length, neighbors: n.values}}) 
				console.log("nodes", nodes);
				
				var links = nodes.map(function(s){
					return s.neighbors.map(function(t){
						return {source: s, target: nodes[+t.key], weight: t.values.length};
					})
				});
				
				links = d3.merge(links);
				console.log("links",links);
				
				var forcelayout = ForceLayout();
				d3.select("#network")
					.datum({ nodes: nodes, links: links})
				.call(forcelayout);
			}
		)
		
	}
	
	return me;
}

var cellPhonesApp = CellPhonesApp();
d3.select("#cell_phones")
.call(cellPhonesApp);