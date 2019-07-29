#!/usr/bin/env python
#coding: utf8

import urllib, urllib2, config
import simplejson as json


SPECS = {
	'description' : 'Fetching comments from Flickr',
	'functions': {
		'photo_comments':{
			'name': 'Photo Comments',
			'param': {
				"photo_id" : {
					"type" : "text",
					"comment" : "ID of photo"
				}
			},
			'returns': {
				'id' : "text",
				'author' : "text",
				'authorname': "text",
				'realname': "text",
				'content': "text",
				'datecreate': "text",
				'permalink': "text",
				'path_alias': "text"
			}
		}
	}
}

def photo_comments(param):
	cosearch = "https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&"
	cosearch2 = "&format=json&nojsoncallback=1"
	key = config.CREDS["flickr_key"]
	pID = param['photo_id']
	q = {"api_key": key, "photo_id": pID}
	url = cosearch + urllib.urlencode(q) + cosearch2

	def call_the_comments():
		result = urllib2.urlopen(url).read()
		return json.loads(result)

	comments = call_the_comments()
	commentList = []
	for comments in comments['comments']['comment']:
		cObj = {
			'id': comments['id'],
			'author': comments['author'],
			'authorname': comments['authorname'],
			'realname': comments['realname'],
			'content': comments['_content'],
			'datecreate': comments['datecreate'],
			'permalink': comments['permalink'],
			'path_alias': comments['path_alias']
		}
		commentList.append(cObj)
	return commentList
