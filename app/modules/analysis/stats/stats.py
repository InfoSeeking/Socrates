#!/usr/bin/python

from __future__ import division
from pyparsing import (Literal,CaselessLiteral,Word,Combine,Group,Optional,ZeroOrMore,Forward,nums,alphas,oneOf)
import math
import operator

SPECS = {	'description' : 'Provides functions for statistical analysis',
	'functions' : {
		'basic' : {
			'param': {
				': {
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
		},
    "gen_math" : {
      'param_order': ['formula', 'xParam'],
      'param': {
        'formula': {
          'type': 'text'
          'comment': 'Expression to be evaluated'
          },
          'xParam': {
          'type': 'field_reference numeric',
          'comment': 'x values',
          }
        }
      }
    },

		"correlation" : {
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

def gen_math (working_set, param=False):
  class NumericStringParser(object):
    def pushFirst(self, strg, loc, toks ):
        self.exprStack.append( toks[0] )
    def pushUMinus(self, strg, loc, toks ):
        if toks and toks[0]=='-': 
            self.exprStack.append( 'unary -' )
    def __init__(self):
        """
        expop   :: '^'
        multop  :: '*' | '/'
        addop   :: '+' | '-'
        integer :: ['+' | '-'] '0'..'9'+
        atom    :: PI | E | real | fn '(' expr ')' | '(' expr ')'
        factor  :: atom [ expop factor ]*
        term    :: factor [ multop factor ]*
        expr    :: term [ addop term ]*
        """
        point = Literal( "." )
        e     = CaselessLiteral( "E" )
        fnumber = Combine( Word( "+-"+nums, nums ) + 
                           Optional( point + Optional( Word( nums ) ) ) +
                           Optional( e + Word( "+-"+nums, nums ) ) )
        ident = Word(alphas, alphas+nums+"_$")       
        plus  = Literal( "+" )
        minus = Literal( "-" )
        mult  = Literal( "*" )
        div   = Literal( "/" )
        lpar  = Literal( "(" ).suppress()
        rpar  = Literal( ")" ).suppress()
        addop  = plus | minus
        multop = mult | div
        expop = Literal( "^" )
        pi    = CaselessLiteral( "PI" )
        expr = Forward()
        atom = ((Optional(oneOf("- +")) +
                 (pi|e|fnumber|ident+lpar+expr+rpar).setParseAction(self.pushFirst))
                | Optional(oneOf("- +")) + Group(lpar+expr+rpar)
                ).setParseAction(self.pushUMinus)       
        # by defining exponentiation as "atom [ ^ factor ]..." instead of 
        # "atom [ ^ atom ]...", we get right-to-left exponents, instead of left-to-right
        # that is, 2^3^2 = 2^(3^2), not (2^3)^2.
        factor = Forward()
        factor << atom + ZeroOrMore( ( expop + factor ).setParseAction( self.pushFirst ) )
        term = factor + ZeroOrMore( ( multop + factor ).setParseAction( self.pushFirst ) )
        expr << term + ZeroOrMore( ( addop + term ).setParseAction( self.pushFirst ) )
        # addop_term = ( addop + term ).setParseAction( self.pushFirst )
        # general_term = term + ZeroOrMore( addop_term ) | OneOrMore( addop_term)
        # expr <<  general_term       
        self.bnf = expr
        # map operator symbols to corresponding arithmetic operations
        epsilon = 1e-12
        self.opn = { "+" : operator.add,
                "-" : operator.sub,
                "*" : operator.mul,
                "/" : operator.truediv,
                "^" : operator.pow }
        self.fn  = { "sin" : math.sin,
                "cos" : math.cos,
                "tan" : math.tan,
                "abs" : abs,
                "trunc" : lambda a: int(a),
                "round" : round,
                "sgn" : lambda a: abs(a)>epsilon and cmp(a,0) or 0}
    def evaluateStack(self, s ):
        op = s.pop()
        if op == 'unary -':
            return -self.evaluateStack( s )
        if op in "+-*/^":
            op2 = self.evaluateStack( s )
            op1 = self.evaluateStack( s )
            return self.opn[op]( op1, op2 )
        elif op == "PI":
            return math.pi # 3.1415926535
        elif op == "E":
            return math.e  # 2.718281828
        elif op in self.fn:
            return self.fn[op]( self.evaluateStack( s ) )
        elif op[0].isalpha():
            return 0
        else:
            return float( op )
    def eval(self,num_string,parseAll=True):
        self.exprStack=[]
        results=self.bnf.parseString(num_string,parseAll)
        val=self.evaluateStack( self.exprStack[:] )
        return val
	parser = NumericStringParser()
results = []
  for x in range (0, len(xParam)):
    xValue = xParam[x]
    modified_formula = ''
    if formula[x] != 'x':
      modified_formula += formula[x]
    else:
      modified_formula += xValue
    r = parser.eval(modified_formula)
    results.append(r)
  return results

def correlation (working_set, param=False):
  field1Vals = param['field_1']
  field2Vals = param['field_2']
  sumX = 0
  sumY = 0
  sum X2 = 0
  sum Y2 = 0
  sumXY = 0
  for i in rang(len(field1Vals)):
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
