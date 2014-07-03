#!/usr/bin/python
'''
Example run:
python socrates_cli.py --input '{"query": "world cup", "count" : 10, "lang" : "en"}' --run collection twitter tw_search 
'''
import sys
import argparse
import modules
from pprint import pprint
import json
import inspect
from translation import *
from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import socrates as SO

def err(msg, fatal=True):
	print json.dumps({
	'error' : 'true',
	'message': msg
	})
	if fatal:
		sys.exit(1)

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

client = MongoClient()
db = client.socrates
parser = argparse.ArgumentParser(description="SOCRATES Social media data collection, analysis, and exploration")
parser.add_argument("--working_set_id", help="ID referencing database working set. Required for analysis", default=False)
parser.add_argument("--return_all_data", help="If present, returns all of working set. Otherwise returns only first 'row'", action='store_true')
parser.add_argument("--input", help="Any input required for the module")
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--run', help='Run the main program, type=collection|analysis',nargs=3, metavar=("type", "module", "function"))
group.add_argument("--specs", help='Retrieve JSON specs for all modules and functions', action='store_true')
group.add_argument("--fetch", help='Retrieve working set from specified id', action='store_true')
args = parser.parse_args()

working_set = None
working_set_id = -1

if args.working_set_id:
	working_set_id = args.working_set_id
	working_set = db.collectionData.find_one({"_id" : ObjectId(working_set_id)})

if args.run:
	typ = args.run[0]
	mod = args.run[1]
	fn = args.run[2]
	param = {}
	if args.input:
		param = json.loads(args.input)
	return_all_data = args.return_all_data

	if typ == "analysis" and working_set is None:
		err("Working set id not included")

	working_set = SO.run(typ, mod, fn, param, working_set)

	if 'error' in working_set and working_set['error']:
		err("Error: " + working_set['message'])

	#store new/modified working set
	if typ == "collection":
		insert_id = db.collectionData.insert(working_set)
		del working_set["_id"] #for some reason ObjectID is not JSON serializable
		working_set['working_set_id'] = str(insert_id)
	elif typ == "analysis":
		working_set["_id"] = ObjectId(working_set_id)
		db.collectionData.save(working_set) #overwrite in database
		del working_set['_id']
		working_set['working_set_id'] = str(working_set_id)

	if not return_all_data:
		#remove all data except first entry
		working_set["data"] = working_set["data"][0:1]
		if "analysis" in working_set:
			for i in range(len(working_set["analysis"])):
				a = working_set["analysis"][i]
				if "entry_analysis" in a:
					for p in a['entry_analysis']:
						a['entry_analysis'][p] = a['entry_analysis'][p][0:1]
	print json.dumps(working_set)

elif args.specs:
	print json.dumps(getAllSpecs())

elif args.fetch:
	working_set = db.collectionData.find_one({"_id" : ObjectId(working_set_id)})
	del working_set['_id']
	working_set['working_set_id'] = str(working_set_id)
	print json.dumps(working_set)