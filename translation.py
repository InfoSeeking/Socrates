'''
The purpose of the translation module is to check for correct parameters, apply default values to parameters not given, and provide metadata about the structure and types of data which is returned from different methods
'''

#given the passed parameters, check if the parameters meet the specified constraints
def checkConstraints(param, paramSpecs,working_set=None):
	return True

def applyDefaults

MODULES = {
	'analysis': {
		'text': {
			'word_count' : {
				'param': {
					'field': {
						'type' : 'field_reference text',
						'comment': 'The text to count words from',
					}
				},
				'returns': {
					'avg_word_count' : 'numeric',
					'min_word_count' : 'numeric',
					'max_word_count' : 'numeric',
					'word_counts': 'array numeric'
				}
			}
			'sentiment' : {
				'param' : {
					'field': {
						'type' : 'field_reference text',
						'comment': 'The text to analyze',
					}
				},
				'returns' : {
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
				'defaults' : {
			        'count': 5,
			        'lang': 'en'
			    },
				'param' : {
		            'query': {
		                'type': 'text',
		                'comment': 'Search query'
		            },
		            'count': {
		                'type': 'numeric',
		                'comment': 'Number of results'
		            },
		            'lang': {
		                'type': 'text',
		                'comment': "Language of results",
		                'constraints': {
		                    'choices': ['en', 'pt', 'it', 'es', 'tr', 'ko', 'fr', 'ru', 'de', 'ja']
		                }
		            }
		        }
			}
		}
	}
}