#!/usr/bin/python

from pymongo import MongoClient
#connect
client = MongoClient()
db = client.socrates
collection = db.testData


#test insert
test_post = {"name" : "test", "data": "YESSIR"}
post_id = collection.insert(test_post)
print post_id

#test retrieve
retrieved = collection.find_one({"_id" : post_id})
print retrieved