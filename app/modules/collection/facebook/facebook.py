#New version of Graph API
import csv
import io
import urllib2
import urllib
import urlparse
import config
try:
    import simplejson as json
except ImportError:
    import json
SPECS = {
    'functions': {
        'facebook_search' : {
            'param_order': ['query', 'type', 'count'],
                'param' : {
                    'query': {
                        'type': 'text',
                        'comment': 'Search query'
                    },'type': {
                        'type': 'text',
                        'constraints':{
                            'choices' : ['page', 'place']
                        },
                    },'count': {
                        'type': 'numeric',
                        'comment': 'Number of results',
                        'default' : 10
                }
                },
                'returns': {
                    'id': 'numeric',
                    'category': 'text',
                    'name': 'text'
            }
    }
}
}


def _request(url, data=None):
    """
        If data is None, makes a GET request, else makes a POST request
        """
    res = urllib2.urlopen(url, data)
    return json.loads(res.read())

def facebook_search(param=False):
    """
        Queries the search endpoint with given params. Query to search for is found
        in the q param.
        """
    data = [] #final data
    result = [] #temporary storage for immediate results
    urlparam = {
        "q" : param["query"],
        "access_token" : config.CREDS["facebook_token"],
        "type" : param["type"]
    }
    #query URL
    q_url = "https://graph.facebook.com/search?%s" % (urllib.urlencode(urlparam))
    #GET request
    result = _request(q_url)
    #count is for getting the number of results inputed by the user
    count = 0
    max = int(param["count"])
    for item in result['data']:
        row = {}
        row['id'] = item['id']
        row['name'] = item['name']
        row['category'] = item['category']
        data.append(row)
        count = count + 1
        if count >= max:
            break
    return data