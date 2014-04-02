#!/usr/bin/python
from flask import Flask, request


app = Flask(__name__)
@app.route("/", methods=['GET', 'POST'])
def getSpecs():
	return "Hello world"

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
