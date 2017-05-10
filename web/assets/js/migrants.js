

function app(){
	
	function me(selection){
		d3.json("assets/data/migrant.json",function(error, json){
			if(error) throw error;
			console.log("migrants", json);
		})
		
		
		
		
	}
	
	return me;
}



var myApp = app();
d3.select("#viz")
.call(myApp);