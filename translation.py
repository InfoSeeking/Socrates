'''
The purpose of the translation module is to check for correct parameters, apply default values to parameters not given, and provide metadata about the structure and types of data which is returned from different methods
'''

#given the passed parameters, check if the parameters meet the specified constraints
def checkConstraints(param, paramSpecs, working_set=None):
	return True

def applyDefaults(param, paramSpecs):
	return

#this will apply the proper conversion since all param values are initially strings
def getParam(param, prop):
	return

MODULES = {
	'analysis': {
		'text': {
			'word_count' : {
				'param': {
					'field': {
						'type' : 'field_reference text',
						'comment': 'The text to count words from',
					},
					'ignore_stopwords': {
						'type' : 'boolean',
						'comment': 'If true, stopwords are ignored in counting'
					}
				},
				'aggregate_result': {
					'total': 'numeric',
					'avg_word_count' : 'numeric',
					'min_word_count' : 'numeric',
					'max_word_count' : 'numeric'
				},
				'entry_result': {
					'word_counts': 'numeric'
				}
			},
			'sentiment' : {
				'param' : {
					'field': {
						'type' : 'field_reference text',
						'comment': 'The text to analyze',
					}
				},
				'entry_result' : {
					'polarities' : 'array numeric',
					'subjectivities': 'array numeric'
				}
			}
		}
	},
	'collection': {
		'reddit': {
			'fetchPosts' : {
				'param': {
					'sub' : {
						'type' : 'text',
						'comment': 'Subreddit'
					},
					'count': {
						'type' : 'numeric',
						'comment' : "Number of posts"
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
				
			}
		},
		'twitter': {
			'tw_search' : {
				'param' : {
		            'query': {
		                'type': 'text',
		                'comment': 'Search query'
		            },
		            'count': {
		                'type': 'numeric',
		                'comment': 'Number of results',
		                'default': 5
		            },
		            'lang': {
		                'type': 'text',
		                'comment': "Language of results",
		                'constraints': {
		                    'choices': ['en', 'pt', 'it', 'es', 'tr', 'ko', 'fr', 'ru', 'de', 'ja']
		                },
		                'default': 'en'
		            }
		        },
		        'returns': {
		            'username': 'text',
		            'usersince': 'date',
		            'followers': 'numeric',
		            'friends': 'numeric',
		            'authorid': 'text',
		            'authorloc': 'text',
		            'geoenable': 'boolean',
		            'source': 'text',
		            'created': 'text',
		            'content': 'text',
		            'tweet_id': 'text',
		            'cords': 'geo',
		            'retwc': 'numeric'  
		    	}
			}
		}
	}
}