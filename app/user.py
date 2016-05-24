from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import config
import hashlib

'''
Defaults to using a test user
'''

username = ""
user_id = -1
run_id = -1

client = MongoClient()
db = client.socrates

if ('mongo' in config.CREDS):
    db.authenticate(config.CREDS['mongo']['username'], config.CREDS['mongo']['password'], "admin")


def authenticate(u, p):
    global username, user_id
    sha1hash = hashlib.sha1()
    sha1hash.update(p)
    hashed = sha1hash.hexdigest()
    result = db.users.find_one({"username": u, "password": hashed})
    if result:
        user_id = result['_id']
        return True
    else:
        return False

def register(u, p):
    # Check if user already exists
    sha1hash = hashlib.sha1()
    sha1hash.update(p)
    hashed = sha1hash.hexdigest()
    result = db.users.find_one({"username": u, "password": hashed})
    if result:
        return False
    db.users.insert_one({"username": u, "password": hashed})
    return True

def getWorkingSet(working_set_id):
    working_set = db.working_set.find_one({"_id" : ObjectId(working_set_id)})
    del working_set['_id']
    return working_set

def getWorkingSets():
    working_sets = list(db.working_set.find({"user_id" : user_id}))
    for i in xrange(len(working_sets)):
        working_set_id = working_sets[i]['_id']
        del working_sets[i]['_id']
        working_sets[i]['working_set_id'] = str(working_set_id)
    return working_sets

#returns the insert id
def addWorkingSet(working_set):
    working_set['user_id'] = user_id
    insert_id = db.working_set.insert_one(working_set).inserted_id
    del working_set['_id']
    return insert_id

def removeWorkingSet(working_set_id):
    db.working_set.remove({"_id" : ObjectId(working_set_id)});

def updateWorkingSet(working_set_id, working_set):
    working_set["_id"] = ObjectId(working_set_id)
    db.working_set.save(working_set)
    del working_set['_id']

def renameWorkingSet(working_set_id, new_name):
    working_set = getWorkingSet(working_set_id)
    working_set["working_set_name"] = new_name
    working_set["_id"] = ObjectId(working_set_id)
    db.working_set.save(working_set)
    del working_set['_id']

def log_run(typ,mod,fn):
    global user_id, run_id
    run_id = db.log.insert_one({
        "namespace": "run",
        "type": typ,
        "module": mod,
        "function": fn,
        "user_id": user_id
        }).inserted_id

#log any general activity (login, logout, etc.)
def log_activity(name, value):
    global user_id, run_id
    db.log.insert_one({
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