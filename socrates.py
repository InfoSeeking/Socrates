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
def run(typ, mod, fn, param, working_set=None):
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
			if 'aggregate_result' in  MODULES[typ][mod][fn]:
				results['aggregate_meta'] = MODULES[typ][mod][fn]['aggregate_result']
			if 'entry_result' in  MODULES[typ][mod][fn]:
				results['entry_meta'] = MODULES[typ][mod][fn]['entry_result']
			if 'analysis' in working_set:
				working_set['analysis'].append(results)
			else:
				working_set['analysis'] = [results]
		elif typ == 'collection':
			working_set = {
				'data' : callingFn(param),
				'meta' : MODULES[typ][mod][fn]['returns']
			}
			#Store this data
		return working_set

def test():
	working_set = run("collection", "twitter", "tw_search", {'query': "Test", 'lang': 'en', 'count': 2})
	#working_set = run("collection", "reddit", "fetchPosts", {'sub': "askscience", 'count': 2})
	working_set = run("analysis", "text", "word_count", {'field': 'content'}, working_set)
	#working_set = run("analysis", "text", "word_count", {'field': 'source'}, working_set)
	working_set = run("analysis", "text", "sentiment", {'field': 'content'}, working_set)
	pprint(working_set)
test()
'''
results = run('collection', 'reddit', 'fetchPosts', {'sub': 'askscience', 'count': 1})
pprint(results)
json.dumps(results)
'''
