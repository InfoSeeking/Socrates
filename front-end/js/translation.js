/*
This file is almost exactly the same as the back-end translation.py just refactored for javascript.
It handles parsing and validating input parameters from the user, (most importantly) resolving field references.
*/
var TRANS = (function(){
	var that = {};
	function getType(val){
		if(typeof(val) == "object" && val.hasOwnProperty("type")){
			return val["type"];
		}
		else{
			return val;
		}
	}
	function isOptional(spec){
		if(typeof(val) == "object" && val.hasOwnProperty("optional") && val["optional"]){
			return val["optional"];
		}
		else{
			return false;
		}
	}
	function isSpecialParam(key){
		return key == "returnAllData" || key == "reference_id";
	}
	function convertBasicType(typ, val){
		if(typ == 'numeric'){
			return parseFloat(val);
		}
		else if(typ == 'text'){
			return val;
		}
		else if(typ == 'boolean'){
			if(/^true$/i.test(val)){
				return true;
			}
			else if(/^false$/i.test(val)){
				return false;
			}
			else{
				//ERROR boolean value not valid
				throw "Boolean value " + val + " not valid";
			}
		}
		else{
			//ERROR parameter type not valid
			throw "Parameter type " + typ + " not valid";
		}
	}
	that.parseParams = function(param, paramSpecs, working_set){
		console.log(param);
		for(var key in param){
			if(param[key] == "" && isOptional(paramSpecs[key])){
				continue;
			}
			if(param.hasOwnProperty(key) && !isSpecialParam(key)){
				var fr = /^field_reference\s+(\w+)$/i;
				var paramType = getType(paramSpecs[key]);
				var match = fr.exec(paramType);
				if(match != null){
					var typ = match[1]; //type of field we are referencing
					var field = param[key];
					//the following array will replace param[key] with actual values
					var value = [];
					//check if the field is referencing an analysis field
					var match = /^analysis\[(\d+)\]\.([_a-zA-Z]+)$/.exec(field);
				
					if(match != null){
						//analysis field
						var index = parseInt(match[1]);
						field = match[2];
						if(!working_set.hasOwnProperty("analysis") || !working_set["analysis"][index]["entry_analysis"].hasOwnProperty(field)){
							throw "Reference to analysis field '" + field + "' does not exist";
						}
						if(getType(working_set['analysis'][index]['entry_meta'][field]) != typ){
							throw "Reference to analysis field '" + field + "' is not of type " + typ;
						}
						//clone the entry analysis array over to the param
						value = working_set['analysis'][index]['entry_analysis'][field].slice(0);
					}
					else{
						//data field
						console.log("In field reference");
						if(working_set["data"].length > 0){
							if(!working_set["data"][0].hasOwnProperty(field)){	
								throw "Reference to data field '" + field + "' does not exist";
							}
							if(getType(working_set["meta"][field]) != typ){
								//we cannot reference a field of this type
								throw "Reference to data field '" + field + "' is not of type " + typ;
							}
							for(var i = 0; i < working_set["data"].length; i++){
								value.push(working_set["data"][i][field]);
							}
						}
					}
					param[key] = value;
				}
				else{
					param[key] = convertBasicType(paramType, param[key]);
				}
			}
		}
	}
	return that;
}());