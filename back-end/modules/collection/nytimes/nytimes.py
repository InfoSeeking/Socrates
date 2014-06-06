#5 Different methods of searching comments on NY Times
#RECENT
#RANDOM
#DATE
#USER ID
#URL

import urllib, urllib2
import simplejson as json

SPECS = {
	'description' : 'Fetching comments from NY Times',
	'functions': {
		'fetch_by_URL':{
			'param': {
				"submission_url" : {
					"type" : "text",
					"comment" : "URL of post (ends with .html)"
				}
			},
			'returns': {
				'approveDate': "text",
				'commentBody': "text",
				'commentSequence': "numeric",
				'commentTitle': "text",
				'display_name': "text",
				'editorsSelection': "boolean",
				'email_status': "text",
				'location': "text",
				'recommendations': "numeric",
				#'replies': "array",
				'sharing': "numeric",
				'status': "text",
				'times_people': "numeric",
				'userComments': "text",
				#'userTitle': "text",
				#'userURL': "text"
			}
		}
	}
}
	
def fetch_by_URL(param):
	matchtype = "exact-match"
	cosearch = "http://api.nytimes.com/svc/community/v2/comments/url/"+matchtype+".json?"
	url = param['submission_url'].strip()
	key = "d7064151a6a66f53a361ba89b0d5d0b6:8:69414651"

	q = {"url":url, "api-key":key}
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