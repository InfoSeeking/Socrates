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
	return json.dumps(SO.getSpecs())

@app.route("/op/<typ>/<mod>/<fn>", methods=['GET', 'POST'])
@crossdomain(origin='*')
def operator(typ, mod, fn):
	if request.method == 'GET':
		return 'Please use a POST request'
	param = request.form #post data
	print param
	#return "%s %s %s %s " % (type, mod, fn, param)
	print "About to run"
	return json.dumps(SO.run(typ, mod, fn, param))
	#return "Testing\n"

if __name__ == "__main__":
    app.run(debug=True)
