#!/usr/bin/env python

# TWITTER SEARCH CRAWLER
#
# By: Ziad Matni
# Last modified: 10/16/2013
#

import base64, getpass, time, datetime, sys
import simplejson, urllib, urllib2
import re, math, argparse
from TwitterSearch import *

#import tweepy, pymongo
#from pymongo import Connection

# Mongo establish connection & define RDB
#connection = Connection()
#db = connection.stocksdb

# Authentication (OAtuh)
f = open('./auth.k')
a1 = f.read()
a2 = f.read()
a3 = f.read()
a4 = f.read()
f.close()
print a1,"  ",a2,"  ",a3,"  ",a4

#auth1 = tweepy.auth.OAuthHandler(a1, a2)
#auth1.set_access_token(a3, a4)
#api = tweepy.API(auth1)

tso = TwitterSearchOrder()
tso.setKeywords(['Rutgers']) 
tso.setLanguage('en') 
tso.setCount(7) 
tso.setIncludeEntities(False) # don't give all entity information

ts = TwitterSearch(
    consumer_key = a1,
    consumer_secret = a2,
    access_token = a3,
    access_token_secret = a4 )

for tweet in ts.searchTweetsIterable(tso): 
    print( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )

#try:
#    tso = TwitterSearchOrder()
#    tso.setKeywords(['Rutgers']) 
#    tso.setLanguage('en') 
#    tso.setCount(7) 
#    tso.setIncludeEntities(False) # don't give all entity information
#
#    ts = TwitterSearch(
#        consumer_key = a1,
#        consumer_secret = a2,
#        access_token = a3,
#        access_token_secret = a4 )
#
#    for tweet in ts.searchTweetsIterable(tso): 
#        print( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )
#
#except TwitterSearchException as e:
#    print(e)

