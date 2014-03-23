#!/usr/bin/python
from textblob import TextBlob
import translation

SPECS = {
	'description' : 'Provides functions for textual analysis',
	'functions' : {
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
				'polarity' : 'numeric',
				'subjectivity': 'numeric'
			}
		}
	}
}

def word_count(working_set, param=False):
	fieldVals = param['field'] #remember, this has been converted to an array of the referenced field values
	avg_word_count = -1
	min_word_count = -1
	max_word_count = -1
	word_counts = []

	for r in fieldVals:
		words = r.split() #default splits by whitespace
		n = float(len(words))
		avg_word_count += n
		if min_word_count == -1 or n < min_word_count:
			min_word_count = n
		if max_word_count == -1 or n > max_word_count:
			max_word_count = n
		word_counts.append(n)

	total = avg_word_count
	avg_word_count /= len(fieldVals)
	return {
		#'meta' : res_meta,
		'aggregate_analysis': {
			'total': total,
			'avg_word_count' : avg_word_count,
			'min_word_count' : min_word_count,
			'max_word_count' : max_word_count,
		},
		'entry_analysis': {
			'word_counts': word_counts
		}
	}

def sentiment(working_set, param):
	fieldVals = param['field']
	arr = working_set['data']

	polarities = []
	subjectivities = []

	for r in fieldVals:
		post = TextBlob(r)
		polarities.append(post.sentiment.polarity)
		subjectivities.append(post.sentiment.subjectivity)

	return {
		'entry_analysis' : {
			'polarity' : polarities,
			'subjectivity': subjectivities
		}
	}