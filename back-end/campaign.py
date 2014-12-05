from pymongo import MongoClient
from bson import objectid
from bson.objectid import ObjectId
import _mysql
import config

client = MongoClient()
mongodb = client.socrates

class Campaign:
    def __init__(self, working_set_id=None, specs=None, inp=None, new_campaign=True):
        if working_set is None:
            self.working_set_id = None
        else:
            self.working_set_id = working_set["working_set_id"]
        self.input = inp
        self.specs = specs
        self.new_campaign = new_campaign
        self.checkpoint = {
            "current_count" : 0
        }

        if new_campaign is False:
            #fetch from mongo
            data = mongodb.campaign.find_one({"working_set_id" : ObjectId(self.working_set_id)})
            self.input = data.input
            self.checkpoint = data.checkpoint
            self.working_set_id
        
    def save(self):
        campaign = {
            "working_set_id" : working_set_id,
            "input" : inp,
            "checkpoint" : checkpoint
        }
        mongodb.campaign.insert(campaign)

    def getSpec(self, key):
        return self.specs[key]

    def getCheckpointField(self, key):
        return self.checkpoint[key]

    def setCheckpointField(self, key, value):
        self.checkpoint[key] = value