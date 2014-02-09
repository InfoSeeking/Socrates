import json
import praw
import config

def _getPraw():
	r = praw.Reddit(user_agent="Socrates data collection bot by /u/kevinAlbs")
	r.login(config.CREDS["reddit"]["uname"], config.CREDS["reddit"]["pass"])
	return r

def fetchPosts(sub,count=10):
	meta = {
        'fields': {
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
		}
    }

	praw = _getPraw()
	posts = praw.get_subreddit(sub).get_top(limit=count)
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
	results = {
		"meta" : meta,
		"data" : pList
	}
	return results