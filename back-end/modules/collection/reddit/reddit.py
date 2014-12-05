import json
import praw
import config
import re
from pprint import pprint

SPECS = {
        'description' : 'Scraping data from Reddit',
        'functions': {
            'fetchPosts' : {
                'param': {
                    'sub' : {
                        'type' : 'text',
                        'comment': 'Subreddit'
                        },
                    'count': {
                        'type' : 'numeric',
                        'comment' : "Number of posts"
                        },
                    'reddit_sorting': {
                        'type' : 'text',
                        'comment' : 'Reddit sorting method',
                        'constraints' : {
                            'choices' : ["hot", "new", "rising", "controversial", "top"]
                            }

                        }
                    }, 
                'returns': {
                    "content": "text",
                    "title": "text",
                    "upvotes": "numeric",
                    "downvotes": "numeric",
                    "user": "text",
                    "nsfw": "boolean",
                    "id": "text",
                    "stickied": "boolean",
                    "url" : "text",
                    "domain": "text",
                    "created_utc": "numeric"
                    },
                },
            'fetchComments':{
                'param': {
                    "submission_id" : {
                        "type" : "text",
                        "comment" : "ID of post (alternately use URL)",
                        "optional" : True
                        },
                    "submission_url" : {
                        "type" : "text",
                        "comment" : "URL of post (alternately use ID)",
                        "optional" : True
                        },
                    "onlyTop" : {
                        "type" : "boolean",
                        "comment" : "If true, it only gets root comments, otherwise it flattens all comment trees"
                        }
                    },
                'returns': {
                    'created': "numeric",
                    'downvotes': "numeric",
                    'upvotes': "numeric",
                    'id': "text",
                    'parent_id': "text",
                    'content': "text"
                    }
                },
            'fetchManyPosts' : {
                'param': {
                    'sub' : {
                        'type' : 'text',
                        'comment': 'Subreddit'
                        },
                    'count': {
                        'type' : 'numeric',
                        'comment' : "Number of posts"
                        },
                    'reddit_sorting': {
                        'type' : 'text',
                        'comment' : 'Reddit sorting method',
                        'constraints' : {
                            'choices' : ["hot", "new", "rising", "controversial", "top"]
                            }
                        }
                    }, 
                'returns': {
                    "content": "text",
                    "title": "text",
                    "upvotes": "numeric",
                    "downvotes": "numeric",
                    "user": "text",
                    "nsfw": "boolean",
                    "id": "text",
                    "stickied": "boolean",
                    "url" : "text",
                    "domain": "text",
                    "created_utc": "numeric"
                    },
                'campaign' : {
                    'limitations' : {
                            'time' : '5'
                        },
                    'meta' : {

                        }
                    }
                }
            }
        }

def _getPraw():
    r = praw.Reddit(user_agent="SOCRATES data collection bot by /u/kevinAlbs")
    r.login(config.CREDS["reddit"]["uname"], config.CREDS["reddit"]["pass"])
    return r

def fetchComments(param):
    r = _getPraw()
    onlyTop = param['onlyTop']
    submission_id = param['submission_id'].strip()
    submission_url = param['submission_url'].strip()
    if(submission_id == ""):
        if(submission_url == ""):
            #TODO error handling in modules
            return None
        else:
            match = re.match("http.*?//.*?/.*?/.*?/.*?/(.*?)/.*$", submission_url)
            submission_id = match.group(1)
            print ("Submission id: " + submission_id)
    if type(onlyTop) is str:
        if onlyTop == "true" or onlyTop == "True":
            onlyTop = True
        else:
            onlyTop = False 
    post = r.get_submission(submission_id=submission_id)
    comments = post.comments
    if not onlyTop:
        #flatten
        comments = praw.helpers.flatten_tree(comments)
    commentList = []
    for c in comments:
        if not hasattr(c, "body"):
            continue #more comment object or something
        cObj = {
                'created': c.created,
                'downvotes': c.downs,
                'upvotes': c.ups,
                'id': c.id,
                'parent_id': c.parent_id,
                'content': c.body
                }
        if c.author is not None:
            cObj['username'] = c.author.name
        commentList.append(cObj)
    return commentList

def fetchPosts(param):
    sub = param['sub']
    count = int(param['count'])
    reddit_sorting = param['reddit_sorting']
    r = _getPraw()
    posts = []
    if reddit_sorting == "top" : 
        posts = r.get_subreddit(sub).get_top(limit=count)
    elif reddit_sorting == "hot" :
        posts = r.get_subreddit(sub).get_hot(limit=count)
    elif reddit_sorting == "new" :
        posts = r.get_subreddit(sub).get_new(limit=count)
    elif reddit_sorting == "rising" :
        posts = r.get_subreddit(sub).get_rising(limit=count)
    elif reddit_sorting == "controversial":
        posts = r.get_subreddit(sub).get_controversial(limit=count)

    pList = []
    for p in posts:
        post = {
                "content": p.selftext,
                "title": p.title,
                "upvotes": p.ups,
                "downvotes": p.downs,
                "user": p.name,
                "nsfw": p.over_18,
                "id": p.id,
                "stickied": p.stickied,
                "url" : p.url,
                "domain": p.domain,
                "created_utc": p.created_utc
                }
        pList.append(post)
    return pList


'''
long term collection function experiment
'''
def fetchManyPosts(param, campaign_meta=None):
    sub = param['sub']
    count = int(param['count'])
    reddit_sorting = param['reddit_sorting']
    r = _getPraw()
    posts = []
    if reddit_sorting == "top" : 
        posts = r.get_subreddit(sub).get_top(limit=count)
    elif reddit_sorting == "hot" :
        posts = r.get_subreddit(sub).get_hot(limit=count)
    elif reddit_sorting == "new" :
        posts = r.get_subreddit(sub).get_new(limit=count)
    elif reddit_sorting == "rising" :
        posts = r.get_subreddit(sub).get_rising(limit=count)
    elif reddit_sorting == "controversial":
        posts = r.get_subreddit(sub).get_controversial(limit=count)

    pList = []
    for p in posts:
        post = {
                "content": p.selftext,
                "title": p.title,
                "upvotes": p.ups,
                "downvotes": p.downs,
                "user": p.name,
                "nsfw": p.over_18,
                "id": p.id,
                "stickied": p.stickied,
                "url" : p.url,
                "domain": p.domain,
                "created_utc": p.created_utc
                }
        pList.append(post)
    return pList
