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
      .append("line") 
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
    .attr("r", function(d){return d.weight}); 
     
     
    force.on("tick", tick); 
  } 
   
  function tick(){ 
    link.attr("x1", function(d) { return d.source.x; }) 
      .attr("y1", function(d) { return d.source.y; }) 
      .attr("x2", function(d) { return d.target.x; }) 
      .attr("y2", function(d) { return d.target.y; }); 
 
    node.attr("cx", function(d) { return d.x; }) 
      .attr("cy", function(d) { return d.y; }); 
  } 
   
  return me; 
}