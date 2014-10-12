import sys

import time, datetime, sys
import re, math, argparse
import urllib, urlparse
import tweepy
import os

#import simplejson
#import MySQLdb


SPECS = {
    'functions': {
            'twitter_search' : {
                #as a workaround for Python's reordering of dictionary keys (instead of making things even more verbose) I think the best option is to specify ordering
                'param_order': ['query', 'count', 'lang', 'latitude', 'longitude', 'radius'],
                'param' : {
                    'query': {
                        'type': 'text',
                        'comment': 'Search query'
                    },
                    'count': {
                        'type': 'numeric',
                        'comment': 'Number of results',
                        'default': 10
                    },
                    'lang': {
                        'type': 'text',
                        'comment': "Language of results",
                        'constraints': {
                            'choices': ['en', 'pt', 'it', 'es', 'tr', 'ko', 'fr', 'ru', 'de', 'ja']
                        },
                        'default': 'en'
                    },
                    "longitude" : {
                        "type" : "numeric",
                        "optional": True
                    },
                    "latitude" : {
                        "type" : "numeric",
                        "optional": True
                    },
                    "radius" : {
                        "type" : "numeric",
                        "optional": True,
                        "comment": "Radius in kilometers"
                    }
                },
                'returns': {
                    'username': 'text',
                    'usersince': 'date',
                    'followers': 'numeric',
                    'friends': 'numeric',
                    'authorid': 'text',
                    'authorloc': 'text',
                    'geoenable': 'boolean',
                    'source': 'text',
                    'created': 'text',
                    'content': 'text',
                    'tweet_id': 'text',
                    'cords': 'geo',
                    'retwc': 'numeric'  
                }
            }
    }
}
# AUTHENTICATION (OAuth)
def tw_oauth(authfile):
    with open(authfile, "r") as f:
        ak = f.readlines()
    f.close()
    auth1 = tweepy.auth.OAuthHandler(ak[0].replace("\n",""), ak[1].replace("\n",""))
    auth1.set_access_token(ak[2].replace("\n",""), ak[3].replace("\n",""))
    return tweepy.API(auth1)

def twitter_search(param=False):
    query = param['query']
    cnt=int(param['count'])
    lang=param['lang']
    geo = False
    if "longitude" in param and param["longitude"] != "":
        lon = param["longitude"]
        if "latitude" in param and param["latitude"] != "":
            lat = param["latitude"]
            if "radius" in param and param["radius"] != "":
                rad = param["radius"]
                geo = "%f,%f,%fkm" % (lat, lon, rad)

    #If this is run as a script, __name__  is main, so argv[0] is file path
    if __name__ == '__main__':
        path = os.path.split(sys.argv[0])[0]
    #Else the module was imported and it has a __file__ attribute that will be the full path of the module.
    else:
        path = os.path.split(__file__)[0]
    path += "/"

    authfile = path + 'auth.k'
    api = tw_oauth(authfile)
    results = {}
    data = []
    maxTweets = cnt
    cnt = 0

    if(not geo):
        tResults = tweepy.Cursor(api.search, q=query, count=cnt, lang=lang)
    else:
        print "Searching from " + geo
        tResults = tweepy.Cursor(api.search, q=query, count=cnt, lang=lang, geocode=geo)

    for tweet in tResults.items():
        dTwt = {}
        dTwt['created'] = str(tweet.created_at)   #tweet created
        dTwt['content']    = tweet.text         #tweet text
        dTwt['tweet_id'] = tweet.id          #tweet ID# (not author ID#)
        dTwt['cords']   = tweet.coordinates  #geographic co-ordinates
        dTwt['retwc']   = tweet.retweet_count #re-tweet count
        dTwt['username'] = tweet.author.name
        dTwt['usersince'] = str(tweet.author.created_at)      #author/user profile creation date
        dTwt['followers'] = tweet.author.followers_count #number of author/user followers (inlink)
        dTwt['friends']   = tweet.author.friends_count   #number of author/user friends (outlink)
        dTwt['authorid']  = tweet.author.id              #author/user ID#
        dTwt['authorloc'] = tweet.author.location        #author/user location
        dTwt['geoenable'] = tweet.author.geo_enabled     #is author/user account geo enabled?
        dTwt['source']    = tweet.source                 #platform source for tweet
        data.append(dTwt)
        cnt += 1
        if cnt >= maxTweets: break
    return data