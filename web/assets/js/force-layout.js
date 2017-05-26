function ForceLayout(){
	var width = 900;
	var height = 900;
  var link; 
  var node; 
   
  var svg; 
   
  var force = d3.layout.force()
	  .gravity(0.3) 
  	.linkDistance(150)
  .charge(-100)
  ; 
  
  var linkStrokeScale = d3.scale.linear()
  .range([0,20]);
   
  function me(selection){ 
     
	 linkStrokeScale
	  	.domain(d3.extent(selection.datum().links, function(l){return l.weight}))
	 
	 
    force.nodes(selection.datum().nodes) 
      .links(selection.datum().links) 
      .size([width,height]) 
    .start() 
     
    if(!svg){ 
      svg = selection.append("svg") 
      .attr({width:width, height:height}); 
    } 
     
    link = svg.append("g") 
      .classed("links",true) 
      .selectAll(".link") 
      .data(svg.datum().links) 
      .enter() 
      .append("path") 
      .classed("link", true) 
      .style("stroke","lightgray") 
    .style("stroke-width", function(d){return linkStrokeScale(d.weight)}); 
 
    node = svg.append("g") 
      .classed("nodes", true) 
      .selectAll(".node") 
      .data(svg.datum().nodes) 
      .enter() 
      .append("circle") 
      .classed("node", true) 
    .attr("r", function(d){return d.weight})
	.on("click", function(d){
		toggleNode(d);
		tick();
	}); 
     
     
    force.on("tick", tick); 
  } 
  
  function toggleNode(n){
	  n.highlight = !n.highlight;
  }
   
  function tick(){ 
	  link.attr("d", function(d) { 
	      var dx = d.target.x - d.source.x, 
	          dy = d.target.y - d.source.y, 
	          dr = Math.sqrt(dx * dx + dy * dy); 
	      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y; 
	      }); 
 
    node.attr("cx", function(d) { return d.x; }) 
      .attr("cy", function(d) { return d.y; })
		  .classed("highlight", function(d){return d.highlight});
	  
	 
  } 
   
  return me; 
}