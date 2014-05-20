#!/usr/bin/python

SPECS = {
	'description' : 'Provides functions for statistical analysis',
	'functions' : {
		'basic' : {
			'param': {
				'field': {
					'type' : 'field_reference numeric',
					'comment': 'Field to analyze',
				}
			},
			'aggregate_result': {
				'total': 'numeric',
				'max' : 'numeric',
				'min' : 'numeric',
				'average' : 'numeric',
				'variance' : 'numeric',
				'standard_deviation' : 'numeric'
			}
		},
		"binary_operation" : {
			'param_order': ['field_1', 'operation', 'field_2'],
			'param': {
				'field_1': {
					'type' : 'field_reference numeric',
					'comment': 'First field',
				},
				'field_2': {
					'type' : 'field_reference numeric',
					'comment': 'Second field'
				},
				'operation' : {
					'type' : 'text',
					'constraints' : {
						'choices' : ['+', '-', '/', '*']
					}
				}
			},
			'entry_result': {
				'result' : 'numeric'
			}
		}
		#These are the specifications for the function you are creating.
		"correlation" : {
			#It expects two parameters, fields, which reference numeric "database columns".
			#Remember, these specifications serve as a way to build our front-end (the part you see)
			#dynamically. But I also included it here to give you a reference of what to build.
			'param': {
				'field_1': {
					#This numeric field_reference type requests we get a numerical column from the database
					#Hence we get an entire array of numbers returned (one per row)
					'type' : 'field_reference numeric',
					'comment': 'First field',
				},
				'field_2': {
					'type' : 'field_reference numeric',
					'comment': 'Second field'
				}
			},
			#This entry_result says it expects to return a JSON object containing a numeric value named "correlation"
			'entry_result': {
				'correlation' : 'numeric'
			}
		}
	}
}

def basic(working_set, param=False):
	fieldVals = param['field'] 
	average = 0
	total = 0
	variance = 0
	maxVal = fieldVals[0]
	minVal = fieldVals[0]

	for r in fieldVals:
		total += r
		if r > maxVal:
			maxVal = r
		elif r < minVal:
			minVal = r
	
	average = total/len(fieldVals)

	for r in fieldVals:
		variance += (r - average) ** 2
	variance /= len(fieldVals) - 1

	standard_deviation = variance ** (.5)

	return {
		#'meta' : res_meta,
		'aggregate_analysis': {
				'total': total,
				'max' : maxVal,
				'min' : minVal,
				'average' : average,
				'variance' : variance,
				'standard_deviation' : standard_deviation
		},
		'entry_analysis': {}
	}

def binary_operation(working_set, param=False):
	field1Vals = param['field_1']
	field2Vals = param['field_2']
	op = param['operation']
	results = []
	for i in range(len(field1Vals)):
		v1 = field1Vals[i]
		v2 = field2Vals[i]
		r = v1 + v2
		if op == '-':
			r = v1 - v2
		elif op == '/':
			r = v1/v2
		elif op == '*':
			r = v1*v2
		results.append(r)
	return {
		'entry_analysis' : {
			'result' : results
		}
	}
	
#Here is the code for the correlation function.  I am not too sure if I used the param argument correctly, however I looked to your other functions as examples to follow.  
def correlation(working_set, param=False):
	field1Vals = param['field_1']
	field2Vals = param['field_2']
	sumX = 0
	sumY = 0
	sumX2 = 0
	sumY2 = 0
	sumXY = 0
	for i in range(len(field1Vals)):
		sumX += field1Vals[i]
		sumY += field2Vals[i]
		sumX2 += field1Vals[i]**2
		sumY2 += field2Vals[i]**2
		sumXY += field1Vals[i] * field2Vals[i]

	result = (len(field1Vals)*sumXY - sumX*sumY) / ((len(field1Vals)*sumX2 - sumX**2)**(0.5) * (len(field1Vals)*sumY2 - sumY**2)**(0.5))
	#this is the formula that I used for correlation, slightly different than the link you sent me, but the outcome is the same so I hope this is not an issue
	return {
		'entry_result' : {
			'correlation': result
		}
	} #I followed your structure for the other functions on the structure of the return value
