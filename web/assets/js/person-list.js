

function PersonList(){
	
	function me(selection){
		console.log(selection);
		var list = selection.append("div")
			.classed("list-group",true)
			.attr("style","height:620px; overflow:scroll")
			.selectAll("a")
			.data(function(d){return d})
			.enter()
			.append("a")
			.attr("href","#")
		.classed("list-group-item",true)
		.on("click",function(d){console.log(d)});
		list.append("span")
			.classed("badge",true)
		.text(function(d){return d.id});
		list.append("span")
			.text(function(d){return d.person})
			
		
	}
	
	return me;
}