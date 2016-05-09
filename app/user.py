from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import config

'''
Defaults to using a test user
'''

username = ""
user_id = -1
run_id = -1

client = MongoClient()
mongodb = client.socrates

def authenticate(u, p):
    global username, user_id
    result = mongodb.users.find_one({"username": u, "password": p})
    if result:
        user_id = result['_id']
        return True
    else:
        return False

def register(u, p):
    # Check if user already exists
    result = mongodb.users.find_one({"username": u, "password": p})
    if result:
        return False
    mongodb.users.insert_one({"username": u, "password": p})
    return True

def getWorkingSet(working_set_id):
    working_set = mongodb.working_set.find_one({"_id" : ObjectId(working_set_id)})
    del working_set['_id']
    return working_set

def getWorkingSets():
    working_sets = list(mongodb.working_set.find({"user_id" : user_id}))
    for i in xrange(len(working_sets)):
        working_set_id = working_sets[i]['_id']
        del working_sets[i]['_id']
        working_sets[i]['working_set_id'] = str(working_set_id)
    return working_sets

#returns the insert id
def addWorkingSet(working_set):
    working_set['user_id'] = str(user_id)
    insert_id = mongodb.working_set.insert_one(working_set).inserted_id
    del working_set['_id']
    return insert_id

def removeWorkingSet(working_set_id):
    mongodb.working_set.remove({"_id" : ObjectId(working_set_id)});

def updateWorkingSet(working_set_id, working_set):
    working_set["_id"] = ObjectId(working_set_id)
    mongodb.working_set.save(working_set)
    del working_set['_id']

def renameWorkingSet(working_set_id, new_name):
    working_set = getWorkingSet(working_set_id)
    working_set["working_set_name"] = new_name
    working_set["_id"] = ObjectId(working_set_id)
    mongodb.working_set.save(working_set)
    del working_set['_id']

def log_run(typ,mod,fn):
    global user_id, run_id
    run_id = mongodb.log.insert_one({
        "namespace": "run",
        "type": typ,
        "module": mod,
        "function": fn,
        "user_id": user_id
        }).inserted_id

#log any general activity (login, logout, etc.)
def log_activity(name, value):
    global user_id, run_id
    mongodb.log.insert_one({
        "namespace": "activity",
        "name": name,
        "value": value,
        "user_id": user_id,
        "run_id": run_id
        })

''' Sets to using default user '''
def setDefault():
    #first check if test user is in database
    if not authenticate("test", "test"):
        register("test", "test")
    authenticate("test", "test")