#!/usr/bin/python
from modules import *
working_set = collection.twitter.main.tw_search("Test", lang='en')
analysis.text.main.word_count(working_set, "content")