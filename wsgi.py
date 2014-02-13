#!/usr/bin/python
from flask import Flask
#from modules import *
import json
from pprint import pprint
from translation import MODULES

app = Flask(__name__)
@app.route("/", methods=['GET', 'POST'])
def test():
 #   working_set = collection.twitter.tw_search("Test", lang="en")
  #  analysis.text.sentiment(working_set, "content")
    return json.dumps(MODULES)

if __name__ == "__main__":
    app.run()
