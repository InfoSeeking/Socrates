#!/usr/bin/python
from modules import *
from pprint import pprint
import json
import inspect
from translation import MODULES


#should return a JSON object of the functions and their parameters
def getAllFunctions():
	return

def perform(typ, mod, fn, param, data_id=False):
	if typ in MODULES and mod in MODULES[typ] and fn in MODULES[typ][mod]:
		#if this is an analysis call, check if the user has already stored data
		#validate parameters from constraints
		#call method
		#augment with meta information

def run():
	#working_set = collection.reddit.fetchPosts("onetruegod", 10)
	#analysis.text.word_count(working_set, "title")
	#pprint(working_set)
	working_set = collection.twitter.tw_search({'query': "Test", 'lang': 'en', 'count': 1})
	
	analysis.text.sentiment(working_set, {'field': "content"})
	pprint(working_set)
	json.dumps(working_set)
#run()

for m in collection.__all__
	mod = getattr(collection, m)
	for 