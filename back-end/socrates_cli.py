#!/usr/bin/python
'''
Example run:
python socrates_cli.py --input '{"query": "world cup", "count" : 10, "lang" : "en"}' --run collection twitter tw_search 
'''
import traceback
from datetime import datetime
import sys
import os
import argparse
import modules
from pprint import pprint
import json
from translation import *
from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import socrates as SO

origStdout = os.dup(1)
origStderr = os.dup(2)

'''
This output redirection was guess and check
reference: http://stackoverflow.com/questions/4675728/redirect-stdout-to-a-file-in-python/22434262#22434262
I'd like for this to be cleaner
'''

def redirectOutput():
    try:
        #why? - to check if we have write permissions 
        f = open("logs/python.out.log", "a")
        f.close()
        f = open("logs/python.err.log", "a")
        f.close()

        os.close(1)
        os.open("logs/python.out.log", os.O_WRONLY|os.O_APPEND) #goes for lowest available (hence fd 1)
        os.close(2)
        os.open("logs/python.err.log", os.O_WRONLY|os.O_APPEND)
    except IOError as e:
        print "I/O error on log redirection: %s" % (e.strerror)
        sys.exit(1) #without error logging, all hope is lost

def restoreOutput():
    sys.stdout.flush()
    sys.stderr.flush()
    os.close(1)
    os.dup(origStdout) #opens on fd 1 ?
    os.close(origStdout)
    os.close(2)
    os.dup(origStderr)
    os.close(origStderr)

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


def init():
    parser = argparse.ArgumentParser(description="SOCRATES Social media data collection, analysis, and exploration")
    parser.add_argument("--working_set_id", help="ID referencing database working set. Required for analysis", default=False)
    parser.add_argument("--return_all_data", help="If present, returns all of working set. Otherwise returns only first 'row'", action='store_true')
    parser.add_argument("--input", help="Any input required for the module")
    parser.add_argument("--log", help="Redirects all stderr and stdout to logs, only prints working_set", action="store_true")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--run', help='Run the main program, type=collection|analysis',nargs=3, metavar=("type", "module", "function"))
    group.add_argument("--specs", help='Retrieve JSON specs for all modules and functions', action='store_true')
    group.add_argument("--fetch", help='Retrieve working set from specified id', action='store_true')
    args = parser.parse_args()

    if args.log:
        redirectOutput() #if any stdout/stderr from modules occurs, log it (used for API logging)
        dateStr = "--start-%s--\n" % datetime.now()
        sys.stderr.write(dateStr)
        sys.stdout.write(dateStr)
    try:
        client = MongoClient()
        db = client.socrates

        result = "" #string result from each run-type to print at the end
        working_set = None
        working_set_id = -1

        if args.working_set_id:
            working_set_id = args.working_set_id
            working_set = db.collectionData.find_one({"_id" : ObjectId(working_set_id)})

        if args.run:
            typ = args.run[0]
            mod = args.run[1]
            fn = args.run[2]
            print "Running %s, %s, %s\n" % (typ, mod, fn)
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
            result = json.dumps(working_set)

        elif args.specs:
            print "Fetching specs\n"
            result = json.dumps(getAllSpecs())

        elif args.fetch:
            print "Fetching working set %s\n" % working_set_id
            working_set = db.collectionData.find_one({"_id" : ObjectId(working_set_id)})
            del working_set['_id']
            working_set['working_set_id'] = str(working_set_id)
            result = json.dumps(working_set)
    except Exception as e:
        sys.stderr.write("Exception caught: %s\n" % e)
        sys.stderr.write("Stack trace:\n%s\n" % traceback.format_exc())


    if args.log:
        sys.stdout.write("--end--\n")
        sys.stderr.write("--end--\n")
        restoreOutput()

    print result

init()
