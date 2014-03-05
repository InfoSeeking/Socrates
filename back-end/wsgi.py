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

@app.route("/op/<typ>/<mod>/<fn>", methods=['GET', 'POST'])
@crossdomain(origin='*')
def operator(typ, mod, fn):
	if request.method == 'GET':
		return 'Please use a POST request'
	param = request.form #post data
	#return "%s %s %s %s " % (type, mod, fn, param)
	print "About to run"
	if typ == "collection":
		working_set = SO.run(typ, mod, fn, param)
		#TODO: storing working_set unnecessarily stores meta data (for simplicity). Later, this should be altered to save space.
		insert_id = db.collectionData.insert(working_set)
		del working_set["_id"] #for some reason ObjectID is not JSON serializable
		working_set['reference_id'] = str(insert_id)

	elif typ == "analysis":
		if 'reference_id' not in param:
			print "Database id not included"
			return
		data = db.collectionData.find_one({"_id" : ObjectId(param['reference_id'])})
		working_set = SO.run(typ, mod, fn, param, data)
		working_set["_id"] = ObjectId(param['reference_id'])
		db.collectionData.save(working_set) #overwrite in database
		del working_set['_id']
		working_set['reference_id'] = str(param['reference_id'])

	return json.dumps(working_set) + "\n"

if __name__ == "__main__":
    app.run(debug=True)
