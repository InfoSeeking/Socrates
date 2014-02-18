#!/usr/bin/python
from flask import Flask, request
#from modules import *
import json
from pprint import pprint
import socrates as SO
from crossdomain import crossdomain

app = Flask(__name__)
@app.route("/specs", methods=['GET', 'POST'])
@crossdomain(origin='*')
def getSpecs():
	return SO.getSpecs()

@app.route("/op/<type>/<mod>/<fn>", methods=['GET', 'POST'])
@crossdomain(origin='*')
def operator(type, mod, fn):
	if request.method == 'GET':
		return 'Please use a POST request'
	
	if type == "analysis":
		print "Fetching data"

	param = request.form #post data
	#return "%s %s %s %s " % (type, mod, fn, param)
	print "About to run"
	return json.dumps(SO.run(type, mod, fn, param))
	#return "Testing\n"

if __name__ == "__main__":
    app.run(debug=True)
