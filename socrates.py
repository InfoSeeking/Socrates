#!/usr/bin/python
from modules import *
from pprint import pprint
import json
import inspect
from translation import MODULES, checkConstraints, applyDefaults


#should return a JSON object of the functions and their parameters
def getSpecs():
	return json.dumps(MODULES)

def err(msg):
	return {
		'error' : 'true',
		'message': msg
	}

'''
The run method ties together the running of operators.
It will run the operator, store results, and return appropriate data to be sent back to user.
It will store/retrieve stored collection data
'''
def run(typ, mod, fn, param):
	working_set=None
	if typ in MODULES and mod in MODULES[typ] and fn in MODULES[typ][mod]:
		#if this is an analysis call, check if the user has already stored data
		if typ == 'analysis':
			if working_set is None:
				return err("Data not provided")
		#validate parameters from constraints
		if checkConstraints(param, MODULES[typ][mod][fn]['param']) is False:
			return err("Parameters are not valid") #get better error from constraint function
		applyDefaults(param, MODULES[typ][mod][fn]['param'])
		#call method
		callingTyp = collection
		if typ == 'analysis':
			callingTyp = analysis
		callingMod = getattr(callingTyp, mod)
		callingFn = getattr(callingMod, fn)
		#call and augment with meta information
		if typ == 'analysis':
			results = callingFn(working_set, param)
			meta = {
				'source'
				'fields': MODULES[typ][mod][fn]['returns'] #TODO: maybe copy for safety
			}
			if 'analysis' in working_set:
				working_set['analysis'].update(results)
				working_set['analysis']['meta'].update(meta) #TODO: maybe separate meta with module name to prevent conflict
			else:
				working_set['analysis'] = results
				working_set['analysis']['meta'] = meta
		else:
			working_set = {
				'data' : callingFn(param),
				'meta' : MODULES[typ][mod][fn]['returns']
			}
			#Store this data
		return working_set

def main():
	#working_set = collection.reddit.fetchPosts("onetruegod", 10)
	#analysis.text.word_count(working_set, "title")
	#pprint(working_set)
	working_set = collection.twitter.tw_search({'query': "Test", 'lang': 'en', 'count': 1})
	
	analysis.text.sentiment(working_set, {'field': "content"})
	pprint(working_set)
	json.dumps(working_set)
#main()
'''
results = run('collection', 'reddit', 'fetchPosts', {'sub': 'askscience', 'count': 1})
pprint(results)
json.dumps(results)
'''