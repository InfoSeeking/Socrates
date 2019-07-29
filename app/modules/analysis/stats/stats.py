from numeric_string_parser import NumericStringParser

SPECS = {
	'description' : 'Provides functions for statistical analysis',
	'functions' : {
		"gen_math" :{
			'name': 'General Math',
			'param_order': ['formula', 'xParam'],
			'param': {
				'formula': {
					'type': 'text',
					'comment': 'Expression to be evaluated',
				},
				'xParam': {
					'type': 'field_reference numeric',
					'comment': 'x values',
				}
			},
			'entry_result': {
				'result' : 'numeric'
			}
		},
	
				
		'basic' : {
			'name': 'Basic',
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
			'name': 'Binary Operation',
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
		},
		"correlation" : {
			'name': 'Correlation',
			'param': {
				'field_1': {
					'type' : 'field_reference numeric',
					'comment': 'First field',
				},
				'field_2': {
					'type' : 'field_reference numeric',
					'comment': 'Second field'
				}
			},
			'aggregate_result': {
				'correlation' : 'numeric'
			}
		},
		"regression": {
			'name': 'Regression',
			'param': {
				'field_1': {
					'type': 'field_reference numeric',
					'comment': 'First field (X-axis)'
				},
				'field_2': {
					'type': 'field_reference numeric',
					'comment': 'Second field (Y-axis)'
				}
			},
			'aggregate_result': {
				'a_value': 'numeric',
				'b_value': 'numeric',
				'equation': 'text'
			}
		}
	}
}

def gen_math(working_set, param=False):
	parser = NumericStringParser()
	results = []
	xList = param['xParam']
	expression = param['formula']
	for x in range(len(xList)):
		xValue = xList[x]
		modified_formula = ''
		for i in range (len(expression)):
			if expression[i] != 'x':
				modified_formula += expression[i]
			else:
				modified_formula += str(xValue)
		r=parser.eval(modified_formula)
		results.append(r)
	return 	{
		'entry_analysis' : {
			'result' : results
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

	return {
		'aggregate_analysis' : {
			'correlation': result
		}
	}
	
def regression(working_set, param=False):
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

	a_value = (1.0*sumY*sumX2 - sumX*sumXY)/(len(field1Vals)*sumX2 - sumX**2)
	b_value = (1.0*len(field1Vals)*sumXY - sumX*sumY)/(len(field1Vals)*sumX2 - sumX**2)

	return {
		'aggregate_analysis' : {
			'a_value': a_value,
			'b_value': b_value,
			'equation': "y = " + str(a_value) + " + " + str(b_value) + "x"
		}
	}
