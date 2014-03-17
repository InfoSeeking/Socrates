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
	callFunction: function(mod, fnName, param){
		//get working_set, call function, return html
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
					}
				}
			}
		}
	};
	VIS.addModule("graph", specs);
}());

(function(){
var fn = function(working_set, param){
	var p = document.createElement("p");
	p.innerHTML = "hi";
	return p;
}

VIS.addFunction("graph", "histogram", fn);
}())