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
                'param_order': ['query', 'since', 'until'],
                'param' : {
                    'query': {
                        'type': 'text',
                        'comment': 'Search query'
                    },
                    'since': {
                        'type': 'text',
                        'comment': 'Starting date (e.g. mm/dd/yyyy)',
                        'optional' : True
                    },
                    'until': {
                        'type': 'text',
                        'comment': 'Ending date',
                        'optional' : True
                    }
                },
                'returns': {
                    'from_name': 'text',
                    'from_id': 'numeric',
                    'type': 'text',
                    'num_likes': 'numeric',
                    'created_time': 'text',
                    'message': 'text',
                    'link': 'text',
                    'id': 'numeric'
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

    If since is specified, returns objects from a certain date, else returns as many 
    objects as it can. since can be any date accepted by PHP's strtotime. 
    """

    data = [] #final data
    result = [] #temporary storage for immediate results
    
    urlparam = {
        "q" : param["query"],
        "access_token" : config.CREDS["facebook_token"]
        }
    if "since" in param:
        urlparam["since"] = param["since"]
    if "until" in param:
        urlparam["until"] = param["until"]

    url = "https://graph.facebook.com/search?%s" % (urllib.urlencode(urlparam))
    for i in range(3):
        #fetch 3 pages of results
        res = _request(url)
        if not res or not res.get('data'):
            break
        result.extend(res['data'])
        url = res['paging']['next']
    for res in result:
        row = {}
        row['from_name'] = res['from']['name']
        row['from_id'] = int(res['from']['id'])
        row['type'] = res['type']
        row['num_likes'] = res.get('likes', {}).get('count', 0)
        row['created_time'] = res['created_time']
        row['message'] = res.get('message', '')
        row['link'] = res.get('link', '')
        row['id'] = res['id']
        data.append(row)
    return data