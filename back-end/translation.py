'''
The purpose of the translation module is to check for correct parameters, apply default values to parameters not given, and provide metadata about the structure and types of data which is returned from different methods
'''
import modules
import re
from pprint import *

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
		raise TypeError("Parameter type '" + typ + "' not valid")

#given the passed parameters, check if the parameters meet the specified constraints
def enforceAndConvert(param, paramSpecs, working_set=None):
	try:
		for key in param:
			fr = re.compile("^field_reference\s+(\w+)$")
			match = fr.match(paramSpecs[key]['type'])

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
					for d in working_set['analysis'][index]['entry_analysis'][field]: #this is an array of the values
						value.append(d)
				else:
					#data field
					print "FIELD : " + field
					for d in working_set['data']:
						value.append(d[field])
				#TODO: actually check if the field is in the working_set and error otherwise
				param[key] = value
			else:
				#assume basic type for now
				param[key] = convertBasicType(paramSpecs[key]['type'], param[key])
	except TypeError:
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
	'analysis' : ['text'],#name of imported module
	'collection': ['reddit', 'twitter']
}