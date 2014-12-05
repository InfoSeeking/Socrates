from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import _mysql
import config

client = MongoClient()
mongodb = client.socrates

'''
Need to store checkpoint data
Need to store metadata (from function specs)
Need to store referring working set
'''
class Campaign:
    @staticmethod
    def getAllWorkingSetIds():
        data = mongodb.campaign.find({}, {"working_set_id" : 1})
        ids = []
        for d in data:
            ids.append(d["working_set_id"])
        return ids

    def __init__(self):
        self.working_set_id = None
        self.input = None
        self.specs = None
        self.checkpoint = {
            "current_count" : 0
        }
        self.new = True
        self.finished = False
        self.mod = None
        self.fn = None
        self.cid = None

    def load(self, working_set_id):
        #fetch from mongo
        data = mongodb.campaign.find_one({"working_set_id" : str(working_set_id)})
        self.input = data["input"]
        self.checkpoint = data["checkpoint"]
        self.working_set_id
        self.new = False
        self.mod = data["mod"]
        self.fn = data["fn"]
        self.specs = data["specs"]
        self.working_set_id = str(working_set_id)
        self.cid = data["_id"]

    def save(self):
        campaign = {
            "working_set_id" : self.working_set_id,
            "input" : self.input,
            "checkpoint" : self.checkpoint,
            "mod" : self.mod,
            "fn" : self.fn,
            "specs" : self.specs
        }
        if self.new:
            print "Inserting"
            mongodb.campaign.insert(campaign)
        else:
            print "Saving"
            campaign["_id"] = self.cid
            mongodb.campaign.save(campaign)

    def finish(self):
        mongodb.campaign.remove({"working_set_id" : ObjectId(self.working_set_id)})
        self.finished = True

    def isFinished(self):
        return self.finished

    def getCheckpointField(self, key):
        return self.checkpoint[key]

    def setCheckpointField(self, key, value):
        self.checkpoint[key] = value

    def getWorkingSetId(self):
        return self.working_set_id

    def setWorkingSetId(self, wid):
        self.working_set_id = wid

    def setInput(self, inp):
        self.input = inp

    def getInput(self):
        return self.input

    def setSpecs(self, specs, mod, fn):
        self.specs = specs
        self.mod = mod
        self.fn = fn

    def getSpec(self, key):
        return self.specs[key]

    def getMod(self):
        return self.mod

    def getFn(self):
        return self.fn