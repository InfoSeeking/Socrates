'''
The purpose of the translation module is to check for correct parameters, apply default values to parameters not given, and provide metadata about the structure and types of data which is returned from different methods
'''
import modules
import re
from pprint import *

#returns boolean telling whether key is a special parameter which is not a parameter being fed to a function
def isSpecialParam(key):
	return key == 'returnAllData' or key == 'reference_id'

#given a param/return spec, return it's type depending on whether it is a string or an object
def getType(val):
	if('type' in val):
		return val['type']
	else:
		return val

def isOptional(spec):
	if("optional" in spec and spec["optional"] is True):
		return True
	return False
	
#a basic type is a 'primitive'
def convertBasicType(typ, val):
	if typ == 'numeric':
		return float(val)
	elif typ == 'text':
		return val
	elif typ == 'boolean':
		if re.match('^true$', val, flags=re.I):
			return True
		elif re.match('^false$', val, flags=re.I):
			return False
		else:
			raise TypeError("Boolean value not valid")
	else:
		print "Error on " + typ + " for value " + val
		raise TypeError("Parameter type '" + typ + "' not valid")

#given the passed parameters, check if the parameters meet the specified constraints
def enforceAndConvert(param, paramSpecs, working_set=None):
	try:
		for key in param:
			if isSpecialParam(key):
				#then this parameter is not being fed to our function, so do not check it
				continue
			if param[key] == "" and isOptional(paramSpecs[key]):
				continue

			fr = re.compile("^field_reference\s+(\w+)$")
			paramType = getType(paramSpecs[key])
			match = fr.match(paramType)

			if match:
				typ = match.group(1)
				field = param[key]
				#the following will replace the param, it is an array of the data being referred to
				value = []
				#check if field is a data field or an analysis field
				an = re.compile("^analysis\[(\d+)\]\.([_a-zA-Z]+)$")
				match = an.match(field)
				if match:
					#analysis field
					index = int(match.group(1))
					field = match.group(2)
					if "analysis" not in working_set or field not in working_set['analysis'][index]['entry_analysis']:
						raise TypeError("Reference to analysis field " + field + " does not exist")
					if getType(working_set['analysis'][index]['entry_meta'][field]) != typ:
						raise TypeError("Reference to analysis field " + field + " is not of type " + typ)
					for d in working_set['analysis'][index]['entry_analysis'][field]: #this is an array of the values
						value.append(d)
				else:
					#data field
					if(len(working_set['data']) > 0):
						if field not in working_set['data'][0]:
							raise TypeError("Reference to data field " + field + " does not exist")
						if getType(working_set['meta'][field]) != typ:
							raise TypeError("Reference to data field " + field + " is not of type " + typ)
					for d in working_set['data']:
						value.append(d[field])
				param[key] = value
			else:
				#assume basic type for now
				param[key] = convertBasicType(paramType, param[key])
	except TypeError as te:
		print "TypeError caught in translation:"
		print te
		return False

	return True

def applyDefaults(param, paramSpecs):
	return

#this will apply the proper conversion since all param values are initially strings
def getParam(param, prop):
	return

def getAllSpecs():
	#go through each module, and append the specs to the final JSON object
	finalSpecs = {
		'analysis' : {},
		'collection' : {}
	}
	for typ in MODULE_LIST:
		for mod in MODULE_LIST[typ]:
			callingTyp = getattr(modules, typ)
			callingMod = getattr(callingTyp, mod)
			if not hasattr(callingMod, 'SPECS'):
				print "ERROR: module %s has no specs" % mod
			finalSpecs[typ][mod] = callingMod.SPECS
	return finalSpecs

MODULE_LIST = {
	'analysis' : ['text', 'stats'],#name of imported module
	'collection': ['reddit', 'twitter', 'youtube']
}