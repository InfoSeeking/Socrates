#!/usr/bin/python
import modules
from pprint import pprint
import json
import inspect
from translation import *

#should return a JSON object of the functions and their parameters
def getSpecs():
	return getAllSpecs()

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
	if typ in MODULE_LIST and mod in MODULE_LIST[typ]:
		#if this is an analysis call, check if the user has already stored data
		if typ == 'analysis':
			if working_set is None:
				return err("Data not provided")

		#get module/function references
		callingTyp = getattr(modules, typ)
		callingMod = getattr(callingTyp, mod)
		callingFn = getattr(callingMod, fn)
		fn_specs = callingMod.SPECS['functions']
		#validate parameters from constraints
		if enforceAndConvert(param, fn_specs[fn]['param'], working_set) is False:
			return err("Parameters are not valid") #get better error from constraint function

		applyDefaults(param, fn_specs[fn]['param'])
		#call and augment with meta information
		if typ == 'analysis':
			results = callingFn(working_set, param)
			if 'aggregate_result' in  fn_specs[fn]:
				results['aggregate_meta'] = fn_specs[fn]['aggregate_result']
			if 'entry_result' in  fn_specs[fn]:
				results['entry_meta'] = fn_specs[fn]['entry_result']
			if 'analysis' in working_set:
				working_set['analysis'].append(results)
			else:
				working_set['analysis'] = [results]
		elif typ == 'collection':
			data = callingFn(param)
			working_set = {
				'data' : data, #only if specified
				'meta' : fn_specs[fn]['returns']
			}
			#Store this data
		return working_set

def test():
	working_set = run("collection", "reddit", "fetchComments", {'submission_id': "xbfwb", 'onlyTop': "false"})
	working_set = run("analysis", "text", "word_count", {'field': 'content'}, working_set=working_set)
	working_set = run("analysis", "text", "word_count", {'field': 'analysis[0].word_counts'}, working_set)
	pprint(working_set)
#test()
'''
results = run('collection', 'reddit', 'fetchPosts', {'sub': 'askscience', 'count': 1})
pprint(results)
json.dumps(results)
'''
