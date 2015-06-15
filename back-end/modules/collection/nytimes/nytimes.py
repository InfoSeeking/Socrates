#5 Different methods of searching comments on NY Times
#RECENT xml error
#RANDOM xml error
#DATE
#USER ID
#URL

import urllib, urllib2
import simplejson as json
import config

SPECS = {
    'description' : 'Fetching comments from NY Times',
        'functions': {
            'comments_by_URL':{
                'param': {
                    "submission_url" : {
                        "type" : "text",
                            "comment" : "URL of post (ends with .html)"
                                },
                                "sort" : {
                                    "type" : "text",
                                        "constraints" : {
                                            "choices" : ["newest", "oldest", "recommended", "replied", "editors-selection"]
                                        },
                                        "default" : "newest"
                            }
                    },
                        'returns': {
                            'approveDate': "text",
                                'commentBody': "text",
                                'commentSequence': "numeric",
                                #'commentTitle': "text", #usually empty
                                'display_name': "text",
                                'editorsSelection': "boolean",
                                #'email_status': "text", #usually 0
                                'location': "text",
                                'recommendations': "numeric",
                                #'replies': "array", #usually undefined
                                'sharing': "numeric",
                                #'status': "text", #usually approved
                                'times_people': "numeric",
                                'userComments': "text",
                        #'userTitle': "text", #usually undefined
                        #'userURL': "text" #usually undefined
                            }
            },
                'article_search' : {
                    'param' : {
                        'query' : {
                            "type" : "text",
                                "comment" : "Search query"
                                },
                                "sort" : {
                                    "type" : "text",
                                        "constraints" : {
                                            "choices" : ["newest", "oldest"]
                                        },
                                        "default" : "newest"
                                },
                                "begin_date" : {
                                    "type" : "text",
                                        "comment" : "format YYYYMMDD",
                                        "optional" : True
                                },
                                "end_date" : {
                                    "type" : "text",
                                        "comment" : "format YYYYMMDD",
                                        "optional" : True
                                        }
                    },
                        'returns' : {
                            "web_url" : "text",
                                "headline" : "text",
                                "abstract" : "text",
                                "word_count" : "numeric",
                                "lead_paragraph" : "text",
                                "snippet" : "text"
                    }
            }#,
    #'comments_by_Date':{
    #	'param': {
    #		"date" : {
    #			"type" : "text",
    #			"comment" : "YYYYMMDD"
    #		}
    #	},
    #	'returns': {
    #		'approveDate': "text",
    #		'commentBody': "text",
    #		'commentSequence': "numeric",
    #		#'commentTitle': "text", #usually empty
    #		'display_name': "text",
    #		'editorsSelection': "boolean",
    #		#'email_status': "text", #usually 0
    #		'location': "text",
    #		'recommendations': "numeric",
    #		#'replies': "array", #usually undefined
    #		'sharing': "numeric",
    #		#'status': "text", #usually approved
    #		'times_people': "numeric",
    #		'userComments': "text",
    #		#'userURL': "text" #usually undefined
    #	}
    #}
    }
}

def comments_by_URL(param):
    matchtype = "exact-match"
        cosearch = "http://api.nytimes.com/svc/community/v2/comments/url/"+matchtype+".json?"
        url = param['submission_url'].strip()
        sort = param['sort']
        
        q = {"url":url, "sort":sort, "api-key":config.CREDS["nyt_comment"]}
        url = cosearch+urllib.urlencode(q)
        
        def call_the_articles():
            result = urllib2.urlopen(url).read()
                return json.loads(result)
        
        articles = call_the_articles()
        commentList = []
        for comments in articles['results']['comments']:
            cObj = {
                'approveDate': comments['approveDate'],
                    'commentBody': comments['commentBody'],
                        'commentSequence': comments['commentSequence'],
                        'commentTitle': comments['commentTitle'],
                        'display_name': comments['display_name'],
                        'editorsSelection': comments['editorsSelection'],
                        'email_status': comments['email_status'],
                        'location': comments['location'],
                        'recommendations': comments['recommendations'],
                        'sharing': comments['sharing'],
                        'status': comments['status'],
                        'times_people': comments['times_people'],
                        'userComments': comments['userComments'],
                }
            commentList.append(cObj)
    return commentList

def article_search(param):
    arsearch = "http://api.nytimes.com/svc/search/v2/articlesearch.json?"
        query = param['query']
        sort = param['sort']
        
        q = {"q":query, "sort": sort, "api-key":config.CREDS["nyt_article"]}
        if "begin_date" in param and param["begin_date"] != "":
            q["begin_date"] = param["begin_date"]
        if "end_date" in param and param["end_date"] != "":
            q["end_date"] = param["end_date"]
        
        url = arsearch+urllib.urlencode(q)
        
        def call_the_articles():
            result = urllib2.urlopen(url).read()
                return json.loads(result)
        
        articles = call_the_articles()
        articleList = []
for docs in articles['response']['docs']:
    aObj = {
        'web_url': docs['web_url'],
            'headline': docs['headline']['main'],
                'abstract': docs['abstract'],
                    'word_count': int(docs['word_count']),
                        'lead_paragraph': docs['lead_paragraph'],
                        'snippet': docs['snippet']
                }
            articleList.append(aObj)
    return articleList


#def comments_by_Date(param):
#	date = param['date']
#	cosearch = "http://api.nytimes.com/svc/community/v2/comments/by-date/" + date + ".json?"
#
#	q = {"api-key":config.CREDS["nyt_comment"]}
#	url = cosearch+urllib.urlencode(q)
#
#	def call_the_articles():
#	    result = urllib2.urlopen(url).read()
#	    return json.loads(result)
#
#	articles = call_the_articles()
#	commentList = []
#	for comments in articles['results']['comments']:
#		cObj = {
#			'approveDate': comments['approveDate'],
#			'commentBody': comments['commentBody'],
#			'commentSequence': comments['commentSequence'],
#			'commentTitle': comments['commentTitle'],
#			'display_name': comments['display_name'],
#			'editorsSelection': comments['editorsSelection'],
#			'email_status': comments['email_status'],
#			'location': comments['location'],
#			'recommendations': comments['recommendations'],
#			'sharing': comments['sharing'],
#			'status': comments['status'],
#			'times_people': comments['times_people'],
#			'userComments': comments['userComments'],
#		}
#		commentList.append(cObj)
#	return commentList
