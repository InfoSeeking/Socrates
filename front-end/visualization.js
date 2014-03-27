var VIS = (function(){
	function parseParams(param){

	}

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
		parseParams(param);
		getWorkingSet(param['reference_id'], function(ws){
			VIS.functionReferences[mod][fnName].call(window, display, ws, param);
		});
	};
	return that;
}());

//add a test module
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
			}
		}
	};
	VIS.addModule("graph", specs);

	var fn = function(display, working_set, param){
		var data = working_set.data;
		var out = "";
		var f = param['field'];
		var num_splits = parseInt(param['num_splits'], 10);
		var max = data[0][f];
		var min = data[0][f];
		var w = 500, h = 200;
		var values = [];
		for(var i = 0; i < data.length; i++){
			values.push(data[i][f]);
			if(data[i][f] > max){
				max = data[i][f];
			}
			if(data[i][f] < min){
				min = data[i][f];
			}
		}
		// A formatter for counts.
		var formatCount = d3.format(",.0f");

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
}())