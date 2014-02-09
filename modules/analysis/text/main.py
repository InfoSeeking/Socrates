#!/usr/bin/python

def word_count(result, field):
	if result['meta']['fields'][field] != 'text':
		print "ERROR: Field must be text"
		return None

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
	result['analysis'] = {
		'avg_word_count' : avg_word_count,
		'min_word_count' : min_word_count,
		'max_word_count' : max_word_count,
		'word_counts': word_counts
	}