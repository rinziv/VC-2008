function ForceLayout(){
	var width = 900;
	var height = 900;
	
	var graph;
  var link; 
  var node; 
   
  var svg; 
   
  var force = d3.layout.force()
	  .gravity(0.3) 
  	.linkDistance(150)
  .charge(function(d){return d.highlight?-400: -100})
  ; 
  
  var linkStrokeScale = d3.scale.linear()
  .range([0,20]);
   
  function me(selection){ 
	  graph = selection.datum();
	 
	 linkStrokeScale
	  	.domain(d3.extent(graph.links, function(l){return l.weight}))
	 
	 
    force.nodes(graph.nodes) 
      .links(graph.links) 
      .size([width,height]) 
    .start() 
     
    if(!svg){ 
      svg = selection.append("svg") 
      .attr({width:width, height:height}); 
    } 
     
    link = svg.append("g") 
      .classed("links",true) 
      .selectAll(".link") 
      .data(graph.links) 
      .enter() 
      .append("path") 
      .classed("link", true) 
      // .style("stroke","lightgray") 
    .style("stroke-width", function(d){return linkStrokeScale(d.weight)}); 
 
    node = svg.append("g") 
      .classed("nodes", true) 
      .selectAll(".node") 
      .data(graph.nodes) 
      .enter() 
      .append("circle") 
      .classed("node", true) 
    .attr("r", function(d){return d.weight})
	.call(force.drag)
	.on("dblclick", function(d){
		console.log(d);
		toggleNode(d);
		force.alpha(0.3).start();
		// tick();
	}); 
     
     
    force.on("tick", tick); 
  } 
  
  function toggleNode(n){
	n.highlight = !n.highlight;  
  	var ts = n.neighbors.map(function(_){return graph.nodes[+_.key]});
	ts.forEach(function(nb){
		nb.highlight = n.highlight;
		var tsn = nb.neighbors.map(function(_){return graph.nodes[+_.key]});
		tsn.forEach(function(nb2){
			nb2.highlight = n.highlight;
		})
	})
}
   
  function tick(){ 
	  link.attr("d", function(d) { 
	      var dx = d.target.x - d.source.x, 
	          dy = d.target.y - d.source.y, 
	          dr = Math.sqrt(dx * dx + dy * dy); 
	      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y; 
	      })
		  .classed("highlight", function(l){return l.source.highlight && l.target.highlight}); 
 
    node.attr("cx", function(d) { return d.x; }) 
      .attr("cy", function(d) { return d.y; })
		  .classed("highlight", function(d){return d.highlight});
	  
	 
  } 
   
  return me; 
}