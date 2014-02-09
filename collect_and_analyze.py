#!/usr/bin/python
from modules import *
from pprint import pprint

def run():
	#working_set = collection.reddit.fetchPosts("onetruegod", 10)
	#analysis.text.word_count(working_set, "title")
	#pprint(working_set)
	working_set = collection.twitter.tw_search("Test", lang='en')
	analysis.text.sentiment(working_set, "content")
	pprint(working_set)

run()