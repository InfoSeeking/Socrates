import time, datetime, sys
import re, math, argparse
import urllib, urlparse
import tweepy
#import simplejson
#import MySQLdb

# AUTHENTICATION (OAuth)
def tw_oauth(authfile):
    with open(authfile, "r") as f:
        ak = f.readlines()
    f.close()
    auth1 = tweepy.auth.OAuthHandler(ak[0].replace("\n",""), ak[1].replace("\n",""))
    auth1.set_access_token(ak[2].replace("\n",""), ak[3].replace("\n",""))
    return tweepy.API(auth1)

def tw_search(query, cnt=5, lang='en'):
    authfile = './auth.k'
    api = tw_oauth(authfile)
    results = {}
    meta = {
        'username': 'text',
        'usersince': 'date',
        'followers': 'numeric',
        'friends': 'numeric',
        'authorid': 'text',
        'authorloc': 'text',
        'geoenable': 'boolean',
        'source': 'text',
        'created': 'text',
        'text': 'text',
        'tweet_id': 'text',
        'cords': 'geo',
        'retwc': 'numeric'
    }
    data = []
    maxTweets = cnt
    cnt = 0
    for tweet in tweepy.Cursor(api.search, q=query, count=cnt, lang=lang).items():
        dTwt = {}
        dTwt['created'] = tweet.created_at   #tweet created
        dTwt['text']    = tweet.text         #tweet text
        dTwt['tweet_id'] = tweet.id          #tweet ID# (not author ID#)
        dTwt['cords']   = tweet.coordinates  #geographic co-ordinates
        dTwt['retwc']   = tweet.retweet_count #re-tweet count
        dTwt['username'] = tweet.author.name
        dTwt['usersince'] = tweet.author.created_at      #author/user profile creation date
        dTwt['followers'] = tweet.author.followers_count #number of author/user followers (inlink)
        dTwt['friends']   = tweet.author.friends_count   #number of author/user friends (outlink)
        dTwt['authorid']  = tweet.author.id              #author/user ID#
        dTwt['authorloc'] = tweet.author.location        #author/user location
        dTwt['geoenable'] = tweet.author.geo_enabled     #is author/user account geo enabled?
        dTwt['source']    = tweet.source                 #platform source for tweet
        data.append(dTwt)
        cnt += 1
        if cnt >= maxTweets: break
    results['meta'] = meta
    results['data'] = data
    return results