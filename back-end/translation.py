'''
The purpose of the translation module is to check for correct parameters, apply default values to parameters not given, and provide metadata about the structure and types of data which is returned from different methods
'''
import modules
#given the passed parameters, check if the parameters meet the specified constraints
def checkConstraints(param, paramSpecs, working_set=None):
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