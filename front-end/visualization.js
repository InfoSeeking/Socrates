var VIS = {
	specs : {},//module list
	functionReferences : {},
	addModule: function(mod, specs){
		VIS.specs[mod] = specs;
		VIS.functionReferences[mod] = {};//stores actual functions
	},
	addFunction: function(mod, fnName, fn){
		if(!VIS.specs.hasOwnProperty(mod)){
			return;
		}
		VIS.functionReferences[mod][fnName] = fn
	},
	callFunction: function(display, mod, fnName, param, callback){
		//get working_set
		getWorkingSet(param['reference_id'], function(ws){
			VIS.functionReferences[mod][fnName].call(window, display, ws, param);
		});
	}
};

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
		var max = data[0][f];
		var min = data[0][f];
		for(var i = 0; i < data.length; i++){
			if(data[i][f] > max){
				max = data[i][f];
			}
			if(data[i][f] < min){
				min = data[i][f];
			}
		}
		var num_splits = parseInt(param['num_splits'], 10);
		var range = (max - min)/(num_splits-1);
		if(range <= 0){
			//slight problem
			return $("<p class='err'>Range error</p>");
		}
		console.log("range " + range);
		var toPlot = new Array(num_splits);
		for(var i = 0; i < toPlot.length; i++){toPlot[i] = 0;}
		for(var i = 0; i < data.length; i++){
			//console.log(data[i][f]);
			var point = Math.floor((data[i][f] - min)/range);
			console.log(point);
			toPlot[point] = toPlot[point] + 1;
		}
		console.log(toPlot);
		var w = 500, h = 200;
		var max = d3.max(toPlot);
		var hScale = d3.scale.linear().domain([0, max]).range([0, h]);
		var cScale = d3.scale.linear().domain([0, max]).range([0, 220]);
		var svg = d3.select(display).append("svg").attr("width", w).attr("height", h);
		var barW = (w/toPlot.length);
		svg.selectAll("rect").data(toPlot).enter().append("rect").attr("class", "bar").attr("height", function(d){
	        return hScale(d);
	    }).attr("x", function(d, i){
	    	return barW * i
	    }).attr("width", barW).attr("y", function(d){
	    	return h - hScale(d);
	    }).attr("fill", function(d){
	    	return "rgb(0," + Math.round(cScale(d)) + ",0)";
	    });
	    //add text
	    svg.selectAll("text").data(toPlot).enter().append("text").text(function(d, i){
	    	return d;
	    }).attr("x", function(d, i){
	    	return (barW * i) + (barW/2) - 4;
	    }).attr("y", function(d){
	    	return h - hScale(d) + 15;
	    }).attr("fill", "white");

//I need to read up a bit more on d3
	    svg.selectAll("text.tnode").data(toPlot).enter().append("text").classed(".tnode", true).text(function(d,i){
	    	return Math.round(range * i) + " - " + Math.round(range * (i+1));
	    }).attr("x", function(d, i){
	    	return (barW * i) + 1;
	    }).attr("y", function(d){
	    	return h - 20;
	    }).attr("fill", "red").attr("font-size", "10px");

	}
	VIS.addFunction("graph", "histogram", fn);
}())