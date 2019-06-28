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
            'searchPosts': {
                'param': {
                    'query': {
                        'type': 'text',
                        'comment': 'query'
                    },
                    'sub': {
                        'type': 'text',
                        'comment': 'Subreddit'
                    },
                    'reddit_sorting': {
                        'type': 'text',
                        'comment': 'Reddit sorting method',
                        'constraints': {
                            'choices': ["relevance", "new", "hot", "top", "comments"]
                        }
                    },
                    'time_filter': {
                        'type': 'text',
                        'comment': 'Time filter',
                        'constraints': {
                            'choices': ['all', 'day', 'hour', 'month', 'week', 'year']
                        }

                    }

                },
                'returns': {
                    'title': 'text',
                    'content': 'text',
                    'permalink': 'text',
                    'id': 'text',
                    'upvotes': 'numeric'
                }
            }
        }
    }


def _getPraw():
    r = praw.Reddit(client_id=config.CREDS['reddit']['client_id'],
                    client_secret=config.CREDS['reddit']['client_secret'],
                    password=config.CREDS['reddit']['passwd'],
                    user_agent=config.CREDS['reddit']['user_agent'],
                    username=config.CREDS['reddit']['username'])
    return r


def searchPosts(param):
    r = _getPraw()
    sub = param['sub']
    query = param['query']
    reddit_sorting = param['reddit_sorting']
    time_filter = param['time_filter']
    subreddit = r.subreddit(sub)
    posts = []
    for post in subreddit.search(query, sort=reddit_sorting, time_filter=time_filter):
        pObj = {
            'content': post.selftext,
            'permalink': post.permalink,
            'title': post.title,
            'id': post.id,
            'upvotes': post.score
        }
        posts.append(pObj)
    return posts


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
    submission = r.submission(id=submission_id)
    comments = submission.comments
    if not onlyTop:
        #flatten
        comments = comments.list()
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
    subreddit = r.subreddit(sub)
    posts = []
    if reddit_sorting == "top" :
        posts = subreddit.top(limit=count)
    elif reddit_sorting == "hot" :
        posts = subreddit.hot(limit=count)
    elif reddit_sorting == "new" :
        posts = subreddit.new(limit=count)
    elif reddit_sorting == "rising" :
        posts = subreddit.rising(limit=count)
    elif reddit_sorting == "controversial":
        posts = subreddit.controversial(limit=count)

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
def fetchManyPosts(param, campaign):
    sub = param['sub']
    desired_count = int(param['count'])
    count = min(desired_count, campaign.getSpec("max_count"))
    reddit_sorting = param['reddit_sorting']
    r = _getPraw()
    subreddit = r.subreddit(sub)
    posts = []
    if reddit_sorting == "top" :
        posts = subreddit.top(limit=count)
    elif reddit_sorting == "hot" :
        posts = subreddit.hot(limit=count)
    elif reddit_sorting == "new" :
        posts = subreddit.new(limit=count)
    elif reddit_sorting == "rising" :
        posts = subreddit.rising(limit=count)
    elif reddit_sorting == "controversial":
        posts = subreddit.controversial(limit=count)

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

    #update campaign object
    if campaign is not None:
        current_count = campaign.getCheckpointField("current_count")
        current_count += count
        if current_count > desired_count:
            #campaign is over
            campaign.finish()
        else:
            campaign.setCheckpointField("current_count", current_count)
    return pList