

function CrossFilterChart(){
	var svg;
	var dimension="Dimension";
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
		svg.datum(transformData(selection.datum()))
		.call(nvchart);
	}
	
	me.dimension = function(_){
		if(!arguments.length) return dimension;
		dimension = _;
		
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
	
	function transformData(data){
		return [
			{
				key:"Count " + dimension,
				values: data
					.map(function(d){return {x:d.key, y:d.value}}) // rename proerty name of objects
					.sort(function(a,b){return -a.x + b.x}) // sort by frequency
					//.filter(function(d,i){return i < 10})  // select only first 10 rows
			}
		]
		
		
	}
	
	
	
	return me;
}