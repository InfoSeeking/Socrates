from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import _mysql
import config
import sys

print "This will remove all user data, are you sure you want to do this? (y/n)"
response = raw_input()

if response != "y" and response != "Y":
    print "Exitting"
    sys.exit(0)

print "Removing all MongoDB data"
client = MongoClient()
mongodb = client.socrates
client.socrates.working_set.remove()

print "Removing all user log data"
db = _mysql.connect(host=config.CREDS["mysql"]["host"], user=config.CREDS["mysql"]["user"], passwd=config.CREDS["mysql"]["password"], db=config.CREDS["mysql"]["database"])
db.query("DELETE FROM run_log");