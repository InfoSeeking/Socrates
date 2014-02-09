#!/usr/bin/python
from modules import *
from pprint import pprint
def run():
	working_set = collection.reddit.fetchPosts("onetruegod", 10)
	analysis.text.word_count(working_set, "title")
	pprint(working_set)
	#working_set = collection.twitter.main.tw_search("Test", lang='en')
	#analysis.text.main.word_count(working_set, "content")

run()
