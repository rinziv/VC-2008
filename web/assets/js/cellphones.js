

function CellPhonesApp(){
	
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
				console.log("time extent", d3.extent(calls, function(d){return d.ts}))
			}
		)
		
	}
	
	return me;
}

var cellPhonesApp = CellPhonesApp();
d3.select("#cell_phones")
.call(cellPhonesApp);