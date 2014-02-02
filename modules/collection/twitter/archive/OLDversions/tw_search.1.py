#!/usr/bin/env python
# TWITTER SEARCH CRAWLER
#
# By: Ziad Matni
# Last modified: 10/21/2013

import time, datetime, sys
import re, math, argparse
import simplejson, csv
import urllib, urllib2
import tweepy
#import MySQLdb

# COMMAND PARSER
def tw_parser():

# USE EXAMPLES:
# =-=-=-=-=-=-=
# % twsearch <search term>              --- searches term
# % twsearch <search term> -g sf      --- searches term in SF geographic box <DEFAULT = none>
# % twsearch <search term> -l en      --- searches term with lang=en (English) <DEFAULT = en>
# % twsearch <search term> -t {m,r,p} --- searches term of type: mixed, recent, or popular <DEFAULT = recent>
# % twsearch <search term> -c 12      --- searches term and returns 12 tweets (count=12) <DEFAULT = 1>
# % twsearch <search term> -o {ca, tx, id, co, rtc)   --- searches term and sets output options <DEFAULT = ca, tx>

# Parse the command
    parser = argparse.ArgumentParser(description='Twitter Search')
    parser.add_argument(action='store', dest='query', help='Search term string')
    parser.add_argument('-g', action='store', dest='loca', help='Location (lo, nyl, nym, nyu, dc, sf, nb')
    parser.add_argument('-l', action='store', dest='l', help='Language (en = English, fr = French, etc...)')
    parser.add_argument('-t', action='store', dest='t', help='Search type: mixed, recent, or popular')
    parser.add_argument('-c', action='store', dest='c', help='Tweet count (must be <15)')
    parser.add_argument('-d', action='store', dest='d', help='Destination for output: either screen or DB')
    parser.add_argument('-o', action='store', dest='out', nargs='+', help='Output options: ca, tx, id, co, rtc')
    args = parser.parse_args()

    qw = args.query     # Actual query word(s)

    # Location
    loca = args.loca
    if (not(loca in ('lo', 'nyl', 'nym', 'nyu', 'dc', 'sf', 'nb')) and (loca)):
        print "ERROR: Location must be one of these: lo, nyl, nym, nyu, dc, sf, nb"
        exit()
    if loca:
        ge = locords[loca]

    # Language
    l = args.l
    if (not l):
        l = "en"
    if (not(l in ('en','fr','es','po'))):
        print "ERROR: Languages supported are: en (English), fr (French), es (Spanish), pt (Portuguese)"
        exit()

    # Tweet type
    t = args.t
    if (not t):
        t = "recent"
    if (not(t in ('mixed','recent','popular'))):
        print "ERROR: Search type must be one of: (m)ixed, (r)ecent, or (p)opular"
        exit()

    # Tweet count
    if args.c:
        c = int(args.c)
        if (c > cmax):
            print "Resetting count to ",cmax," (maximum allowed)"
            c = cmax
        if (not (c) or (c < 1)):
            c = 1
    if not(args.c):
        c = 1

    # Output destination
    if (not(d in ('sc', 'db')) and (d)):
        print "ERROR: You didn't specify output destination: either sc (screen) or db (MySQL database). Defaulting to sc (screen)"
        d = "sc"

    # Output choices --- maybe remove?
    choices = ['ca', 'tx', 'id', 'co', 'rtc']
    out = args.out
    if (not(out) or (not((set(out) & set(choices))))):
        print "ERROR: Output choices must be one of: ca, tx, id, co, rtc. Using defaults."
        out = ["ca","tx"]
    else:
        out = (set(args.out) & set(choices))

    #print "Q: %s, LOC: %s, LANG: %s, TYPE: %s, COUNT: %s, OUT: %s" %(qw ,ge ,l ,t ,c, out)

# AUTHENTICATION (OAuth)
def tw_oauth():
    authlist = csv.reader(open(authfile, 'rb'))
    for x in authlist:
        a.append(x[0])

    auth1 = tweepy.auth.OAuthHandler(a[0], a[1])
    auth1.set_access_token(a[2], a[3])
    api = tweepy.API(auth1)

# TWEEPY SEARCH FUNCTION
def tw_search():
    counter = 0
    for tweet in tweepy.Cursor(api.search,
                                q = qw,
                                g = ge,
                                lang = l,
                                result_type = t,
                                count = c).items():

        #TWEET INFO
        created = tweet.created_at   #tweet created
        text    = tweet.text         #tweet text
        tweet_id = tweet.id          #tweet ID# (not author ID#)
        cords   = tweet.coordinates  #geographic co-ordinates
        retwc   = tweet.retweet_count #re-tweet count
        try:
            hashtag = tweet.entities[u'hashtags'][0][u'text'] #hashtags used
        except:
            hashtag = "None"
        try:
            urls    = tweet.entities[u'urls'] #URLs used
        except:
            urls    = "None"
        #AUTHOR INFO
        author    = tweet.author.name            #author name
        usersince = tweet.author.created_at      #author profile creation date
        followers = tweet.author.followers_count #number of author followers (inlink)
        friends   = tweet.author.friends_count   #number of author friends (outlink)
        authorid  = tweet.author.id              #author ID#
        authorloc = tweet.author.location        #author location
        #TECHNOLOGY INFO
        geoenable = tweet.author.geo_enabled     #is author account geo enabled?
        source    = tweet.source                 #platform source for tweet

        if (d == "sc"):
	        print created
	        print text  
	        print tweet_id 
	        print cords   
	        print retwc  
	        print hashtag 
	        print urls   
	        print author   
	        print usersince 
	        print followers 
	        print friends  
	        print authorid 
	        print authorloc 
	        print geoenable 
	        print source   

        if (d == "db"):
            #db = MySQLdb.connect(host="localhost", # your host, usually localhost
            #                     user="john", # your username
            #                     passwd="megajonhy", # your password
            #                     db="jonhydb") # name of the data base
            #cur = db.cursor()

            campaign = "campaign_logs" # "campaign_logs"? or something else?

            #aQuery = "INSERT INTO ",campaign," VALUES('','" + cid + "','twitter','" + \
            #                qid + "','" + today + "','" + timeNow + "','" + timestamp + "')"

            prefix = "cm1111"  # eg. cm1111 ? or something else?
            qid = 0     # what should this be?
            title = ""  # what should this be?
            link = ""   # what should this be?
            url = ""    # what should this be?
            author = tweet.author.name
            authorPage = ""               # what should this be?
            pub_date = tweet.created_at 
            pub_time = ""   # what should this be?
            updated = ""    # what should this be?
            rank = ""       # what should this be?
            date = ""       # what should this be?

            intodb = "INSERT INTO " + prefix + "_twitter VALUES(''," + \
                     qid + "','" + title + "','" + link + "','" + url + "','" + author + "','" + \
                     authorPage + "','" + pub_date + "','" + pub_time + "','" + updated + "','" + \
                     rank + "','" + date + "', '2', '0')"
            print intodb

            #cur.execute(aQuery)
            #aResult = mysql_query($aQuery) or die("0: ". mysql_error())

			#CREATE TABLE `cm1029_twitter` (
			#`tweet_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			#`query_id` int(11) DEFAULT NULL,
			#`title` text,
			#`link` text,
			#`url` text,
			#`author` varchar(200) DEFAULT NULL,
			#`authorpage` text,
			#`pub_date` date DEFAULT NULL,
			#`pub_time` time NOT NULL DEFAULT '00:00:00',
			#`update_time` int(11) DEFAULT NULL,
			#`rank` int(11) DEFAULT NULL,
			#`collectiondate` date DEFAULT NULL,
			#`relevance` tinyint(1) DEFAULT NULL,
			#`deleted` tinyint(1) DEFAULT '0',
			#PRIMARY KEY (`tweet_id`),
			#KEY `query_id` (`query_id`),
			#KEY `deleted` (`deleted`),
			#FULLTEXT KEY `url` (`url`)
			#) ENGINE=MyISAM AUTO_INCREMENT=91410 DEFAULT CHARSET=latin1;

        print
        counter = counter + 1
        if (counter == c):
            exit()

# MAIN ROUTINE
def main():

    # Geo-coordinates of five metropolitan areas
    # London, NYC (lower, middle, upper), Wash DC, San Francisco, New Brunswick (NJ)
    locords =  {'lo': '0, 51.503, 20km',
                'nyl': '-74, 40.73, 2mi',
                'nym': '-74, 40.74, 2mi',
                'nyu': '-73.96, 40.78, 2mi',
                'dc': '-77.04, 38.91, 2mi',
                'sf': '-122.45, 37.74, 5km',
                'nb': '-74.45, 40.49, 2mi'}
    # Maximum allowed tweet count (note: Twitter sets this to ~180 per 15 minutes)
    cmax = 50
    # OAuth key file
    authfile = './auth.k'

    #CKEY = "A2hLT3URk6OZ1TwGCNOmpw"
    #CSEC = "VCooTyH13GQ0BCYt2revG3ycv8IHG3Ki3UrHTe1KJ8"
    #ATOK = "71060978-si9zmRyZ4a9scK91nAuMUOZhzdYewMpepmZbPv02g"
    #ATSC = "Cl6v15svy2uUI55idBAkt9GRwABoQ9ZWCv7cNhq0Fs"
    #f = open('./auth.k')
    #f.close()

    tw_parser()
    tw_oauth()
    tw_search()

if __name__ == "__main__":
    main()
