#!/usr/bin/python
from flask import Flask, request
#from modules import *
import json
from pprint import pprint
import socrates as SO
from crossdomain import crossdomain
from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId

client = MongoClient()
db = client.socrates

app = Flask(__name__)
@app.route("/specs", methods=['GET', 'POST'])
@crossdomain(origin='*')
def getSpecs():
	return json.dumps(SO.getSpecs())

@app.route("/download", methods=['GET', 'POST'])
@crossdomain(origin='*')
def getData():
	if request.method == 'GET':
		return 'Please use a POST request'
	param = request.form #post data
	if 'reference_id' not in param:
			return "Database id not included"
	working_set = db.collectionData.find_one({"_id" : ObjectId(param['reference_id'])})
	del working_set['_id']
	working_set['reference_id'] = str(param['reference_id'])
	return json.dumps(working_set) + "\n"

@app.route("/op/<typ>/<mod>/<fn>", methods=['GET', 'POST'])
@crossdomain(origin='*')
def operator(typ, mod, fn):
	if request.method == 'GET':
		return 'Please use a POST request'
	orig_param = request.form #post data
	#copy over to not immutable dict
	param = {}
	for key in orig_param:
		param[key] = orig_param[key]
	#return "%s %s %s %s " % (type, mod, fn, param)
	if typ == "collection":
		pprint(param)
		working_set = SO.run(typ, mod, fn, param)
		if 'error' in working_set and working_set['error']:
			print "Error: " + working_set['message']
			return json.dumps(working_set)
		#TODO: storing working_set unnecessarily stores meta data (for simplicity). Later, this should be altered to save space.
		insert_id = db.collectionData.insert(working_set)
		del working_set["_id"] #for some reason ObjectID is not JSON serializable
		working_set['reference_id'] = str(insert_id)
	elif typ == "analysis":
		if 'reference_id' not in param:
			return "Database id not included"
		data = db.collectionData.find_one({"_id" : ObjectId(param['reference_id'])})
		working_set = SO.run(typ, mod, fn, param, data)
		if 'error' in working_set and working_set['error']:
			print "Error: " + working_set['message']
			return json.dumps(working_set)
		working_set["_id"] = ObjectId(param['reference_id'])
		db.collectionData.save(working_set) #overwrite in database
		del working_set['_id']
		working_set['reference_id'] = str(param['reference_id'])

	

	if 'returnAllData' not in param or param['returnAllData'] == "false":
		#remove all data except first entry
		working_set["data"] = working_set["data"][0:1]
		if "analysis" in working_set:
			for i in range(len(working_set["analysis"])):
				a = working_set["analysis"][i]
				if "entry_analysis" in a:
					for p in a['entry_analysis']:
						a['entry_analysis'][p] = a['entry_analysis'][p][0:1]
		
		

	return json.dumps(working_set) + "\n"

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
