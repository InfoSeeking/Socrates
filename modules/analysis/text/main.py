#!/usr/bin/python
from textblob import TextBlob

def word_count(result, param=False):
	field = param['field']
	data = result['data']

	avg_word_count = -1
	min_word_count = -1
	max_word_count = -1
	word_counts = []

	for r in data:
		words = r[field].split() #default splits by whitespace
		n = float(len(words))
		avg_word_count += n
		if min_word_count == -1 or n < min_word_count:
			min_word_count = n
		if max_word_count == -1 or n > max_word_count:
			max_word_count = n
		word_counts.append(n)

	avg_word_count /= len(data)
	return {
		'meta' : res_meta,
		'avg_word_count' : avg_word_count,
		'min_word_count' : min_word_count,
		'max_word_count' : max_word_count,
		'word_counts': word_counts
	}

def sentiment(result, param):
	field = param['field']
	data = result['data']

	polarities = []
	subjectivities = []

	for r in data:
		post = TextBlob(r[field])
		polarities.append(post.sentiment.polarity)
		subjectivities.append(post.sentiment.subjectivity)

	return res = {
		'polarities' : polarities,
		'subjectivities': subjectivities
	}