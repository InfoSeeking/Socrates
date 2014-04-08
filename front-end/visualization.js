var VIS = (function(){
	var that = {};
	that.specs = {};//module list
	that.functionReferences = {};
	that.addModule = function(mod, specs){
		VIS.specs[mod] = specs;
		VIS.functionReferences[mod] = {};//stores actual functions
	};
	that.addFunction = function(mod, fnName, fn){
		if(!VIS.specs.hasOwnProperty(mod)){
			return;
		}
		VIS.functionReferences[mod][fnName] = fn
	};
	that.callFunction = function(display, mod, fnName, param, callback){
		//get working_set
		getWorkingSet(param['reference_id'], function(ws){
			try{
				//set data-vis class to <mod>-<fn>
				d3.select(display).attr("data-vis", mod + "-" +fnName);
				TRANS.parseParams(param, that.specs[mod]["functions"][fnName]["param"], ws);
				VIS.functionReferences[mod][fnName].call(window, display, ws, param);
				callback.call();
			}
			catch(e){
				showError("Error: " + e);
			}
		});
	};
	return that;
}());

//add a graph module and two graphing functions
(function(){
	var specs = {
		"functions": {
			"histogram": {
				"param" : {
					"field" : {
						'type' : 'field_reference numeric',
						'comment' : 'Field to plot'
					},
					"num_splits" : {
						'type' : 'numeric',
						'comment' : 'How many subdivisions of the data into ranges'
					}
				}
			},
			"scatterplot" : {
				"param" : {
					"x-field" : {
						"type" : "field_reference numeric",
						"comment" : "Field to plot along x-axis"
					},
					"y-field" : {
						"type" : "field_reference numeric",
						"comment" : "Field to plot along y-axis"
					}
				}
			}
		}
	};
	VIS.addModule("graph", specs);

	var fn = function(display, working_set, param){
		var data = working_set.data;
		var out = "";
		var values = param['field'];
		console.log(values);
		var num_splits = parseInt(param['num_splits'], 10);
		if(num_splits <= 0){
			throw "num_splits must be positive";
		}
		var max = values[0];
		var min = values[0];
		var w = 500, h = 200;
		for(var i = 0; i < values.length; i++){
			if(values[i] > max){
				max = values[i];
			}
			if(values[i] < min){
				min = values[i];
			}
		}
		// A formatter for counts.
		var formatCount = d3.format(",.0f");
		var barwidth = w/num_splits;//x(data[0].dx);
		var margin = {top: 10, right: 30, bottom: 30, left: 30};

		var x = d3.scale.linear()
		    .domain([0, max+1])
		    .range([0, w]);

		// Generate a histogram using twenty uniformly-spaced bins.
		var data = d3.layout.histogram().bins(x.ticks(num_splits))(values);

		var y = d3.scale.linear()
		    .domain([0, d3.max(data, function(d) { return d.y; })])
		    .range([h, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var svg = d3.select(display).append("svg")
		    .attr("width", w + margin.left + margin.right)
		    .attr("height", h + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var bar = svg.selectAll(".bar")
		    .data(data)
		  .enter().append("g")
		    .attr("class", "bar")
		    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		bar.append("rect")
		    .attr("x", 1)
		    .attr("width", x(data[0].dx) - 1)
		    .attr("height", function(d) { return h - y(d.y); });

		bar.append("text")
		    .attr("dy", ".75em")
		    .attr("y", 6)
		    .attr("x", x(data[0].dx) / 2)
		    .attr("text-anchor", "middle")
		    .text(function(d) { return formatCount(d.y); });

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + h + ")")
		    .call(xAxis);

	}
	VIS.addFunction("graph", "histogram", fn);


	var fn = function(display, working_set, param){
		console.log("HERE");
		var x = param["x-field"]; //arrays of equal length corresponding to (x,y) points
		var y = param["y-field"];
		console.log(x);
		//Width and height
			var w = 500;
			var h = 200;
			var padding = 30;

			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([d3.min(x), d3.max(x)])
								 .range([padding, w - padding * 2]);

			var yScale = d3.scale.linear()
								 .domain([d3.min(y), d3.max(y)])
								 .range([h - padding, padding]);

			var rScale = d3.scale.linear()
								 .domain([0, d3.max(y)])
								 .range([2, 5]);

			var formatAsPercentage = d3.format(".1");

			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5)
							  .tickFormat(formatAsPercentage);

			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(5)
							  .tickFormat(formatAsPercentage);

			//Create SVG element
			var svg = d3.select(display)
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create circles
			svg.selectAll("circle")
			   .data(x)
			   .enter()
			   .append("circle")
			   .attr("cx", function(xV) {
			   		return xScale(xV);
			   })
			   .attr("cy", function(xV, i) {
			   		return yScale(y[i]);
			   })
			   .attr("r", function(xV, i) {
			   		return rScale(y[i]);
			   });
			//Create X axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);

	}
	VIS.addFunction("graph", "scatterplot", fn);

}())