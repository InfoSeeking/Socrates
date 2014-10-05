from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import _mysql
import config

'''
Defaults to using a test user
'''

db = _mysql.connect(host=config.CREDS["mysql"]["host"], user=config.CREDS["mysql"]["user"], passwd=config.CREDS["mysql"]["password"], db=config.CREDS["mysql"]["database"])

def authenticate(username, password):
    pass

def register(user, password):
    e_user = db.escape_string(user)
    e_password = db.escape_string(password)
    #check if user already exists
    q = "SELECT * FROM user WHERE username='%s'" % e_user
    db.query(q)
    r = db.store_result()
    if r.num_rows() > 0:
        return False

    q = "INSERT INTO user (username, password) VALUES ('%s', SHA1('%s'))" % (e_user, e_password)
    print q
    db.query(q)
    return True

def getWorkingSets():
    pass

def addWorkingSet(working_set):
    pass

def log(typ,mod,fn,time):
    pass

''' Sets to using default user '''
def setDefault():
    pass