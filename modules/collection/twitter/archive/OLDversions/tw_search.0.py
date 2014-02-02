#!/usr/bin/env python
# TWITTER SEARCH CRAWLER
#
# By: Ziad Matni
# Last modified: 10/21/2013

import base64, getpass, time, datetime, sys
import simplejson, urllib, urllib2
import re, math, argparse
import tweepy

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
    # Maximum allowed tweet count (note: Twitter sets this to 180 per 15 minutes)
    cmax = 15

# USE EXAMPLES:
# =-=-=-=-=-=-=
# % twsearch <search term>              --- searches term
# % twsearch <search term> -g sf      --- searches term in SF geographic box <DEFAULT = none>
# % twsearch <search term> -l en      --- searches term with lang=en (English) <DEFAULT = en>
# % twsearch <search term> -t {m,r,p} --- searches term of type: mixed, recent, or popular <DEFAULT = recent>
# % twsearch <search term> -c 12      --- searches term and returns 12 tweets (count=12) <DEFAULT = 1>
# % twsearch <search term> -o {ca, tx, id, co, rtc, geo)   --- searches term and sets output options <DEFAULT = ca, tx>

# Parse the command
    parser = argparse.ArgumentParser(description='Twitter Search')
    parser.add_argument(action='store', dest='query', help='Search term string')
    parser.add_argument('-g', action='store', dest='loca', help='Location (lo, nyl, nym, nyu, dc, sf, nb')
    parser.add_argument('-l', action='store', dest='l', help='Language (en = English, fr = French, etc...)')
    parser.add_argument('-t', action='store', dest='t', help='Search type: mixed, recent, or popular')
    parser.add_argument('-c', action='store', dest='c', help='Tweet count (must be <15)')
    parser.add_argument('-o', action='store', dest='out', nargs='+', help='Output options: ca, tx, id, co, rtc, geo')
    args = parser.parse_args()

    qw = args.query
    ge = ''
    loca = args.loca
    if (not(loca in ('lo', 'nyl', 'nym', 'nyu', 'dc', 'sf', 'nb')) and (loca)):
        print "ERROR: Location must be one of these: lo, nyl, nym, nyu, dc, sf, nb"
        exit()
    if loca:
        ge = locords[loca]
    l = args.l
    if (not l):
        l = "en"
    if (not(l in ('en','fr','es','po'))):
        print "ERROR: Languages supported are: en (English), fr (French), es (Spanish), pt (Portuguese)"
        exit()
    t = args.t
    if (not t):
        t = "recent"
    if (not(t in ('mixed','recent','popular'))):
        print "ERROR: Search type must be one of: (m)ixed, (r)ecent, or (p)opular"
        exit()
    if args.c:
        c = int(args.c)
        if (c > cmax):
            print "Resetting count to ",cmax," (maximum allowed)"
            c = cmax
        if (not (c) or (c < 1)):
            c = 1
    if not(args.c):
        c = 1
    choices = ['ca', 'tx', 'id', 'co', 'rtc', 'geo']
    out = args.out
    if (not(out) or (not((set(out) & set(choices))))):
        print "ERROR: Output choices must be one of: ca, tx, id, co, rtc, geo. Using defaults."
        out = ["ca","tx"]
    else:
        out = (set(args.out) & set(choices))

    print "Q: %s, LOC: %s, LANG: %s, TYPE: %s, COUNT: %s, OUT: %s" %(qw ,ge ,l ,t ,c, out)

# Authentication (OAuth)
    CKEY = "A2hLT3URk6OZ1TwGCNOmpw"
    CSEC = "VCooTyH13GQ0BCYt2revG3ycv8IHG3Ki3UrHTe1KJ8"
    ATOK = "71060978-si9zmRyZ4a9scK91nAuMUOZhzdYewMpepmZbPv02g"
    ATSC = "Cl6v15svy2uUI55idBAkt9GRwABoQ9ZWCv7cNhq0Fs"

    #f = open('./auth.k')
    #f.close()

    auth1 = tweepy.auth.OAuthHandler(CKEY, CSEC)
    auth1.set_access_token(ATOK, ATSC)
    api = tweepy.API(auth1)

#  Searching

    counter = 0
    for tweet in tweepy.Cursor(api.search,
                                q = qw,
                                g = ge,
                                lang = l,
                                result_type = t,
                                count = c).items():

        #print type(tweet)
        for ox in out:
            if ox == 'ca':
                print tweet.created_at, "\t",
            if ox == 'tx':
                print tweet.text, "\t",
            if ox == 'id':
                print tweet.id, "\t",
            if ox == 'co':
                print tweet.coordinates, "\t",
            if ox == 'rtc':
                print tweet.retweet_count, "\t",
            if ox == 'geo':
                print tweet.geo, "\t",

        print
        counter = counter + 1
        if (counter == c):
            exit()
    
if __name__ == "__main__":
    main()
