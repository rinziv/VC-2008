

function FilteredChart(){
	// the column to use to group data
	var dimension = "Technique";
	// a function to filter a subset of rows
	var filter= function(d){return true};
	var svg;
	var nvchart = nv.models.multiBarHorizontalChart()
				.margin({left:70})
				.showLegend(false)
				.showControls(false);
	var height = 400;
	var sortValues = true;
	
	function me(selection){
		console.log("chart data", selection.datum());
		
		if(!svg){
			selection.append("h4")
			.text(dimension);
			
			svg = selection.append("svg")
			.attr({width:"100%", height:height});
		}
		svg.datum(groupDataBy(selection.datum(),dimension))
		.call(nvchart);
	}
	
	me.dimension = function(_){
		if(!arguments.length) return dimension;
		dimension = _;
		
		return me;
	}
	
	me.filter = function(_){
		if(!arguments.length) return filter;
		filter = _;
		
		return me;
	}
	
	me.height = function(_){
		if(!arguments.length) return height;
		height = _;
		
		return me;
	}
	
	me.nvchart = function(_){
		if(!arguments.length) return nvchart;
		nvchart = _;
		
		return me;
	}
	
	function groupDataBy(data, dimension){
		var filtered = data.filter(filter);

		
		var grouped = d3.nest()
			.key(function(d){return d[dimension]})
			.rollup(function(leaves){return leaves.length})
		.entries(filtered);
		
		return [
			{
				key:"Count " + dimension,
				values: grouped
					.map(function(d){return {x:d.key, y:d.values}}) // rename proerty name of objects
					//.sort(function(a,b){return -a.x + b.x}) // sort by frequency
					.sort(d3.comparator().order(d3.ascending, function(d){return d.x}))
					//.filter(function(d,i){return i < 10})  // select only first 10 rows
			}
		]
	}
	
	
	
	return me;
}