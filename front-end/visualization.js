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
}());

(function(){
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
	d3.select(display).selectAll("div").data(toPlot).enter().append("div").attr("class", "bar").style("height", function(d){
        return d + 'px';
    });
}

VIS.addFunction("graph", "histogram", fn);
}())