#Anastasia Version 1
#READY FOR TESTING
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
    "functions": {
        "search" : {
            "param_order" : ["query", "order"],
            "param" : {
                "query" : {
                    "type" : "text",
                    "comment" : "The query for the YouTube search"
                },
                "order" : {
                    "type" : "text",
                    "constraints":{
                        "choices" : ["date", "rating", "relevance", "title", "videoCount", "viewCount"]
                }
        }
            },
            "returns" : {
                "title" : "text",
                "publishedAt" : "text",
                "id" : "text",
                "viewCount" : "numeric",
                "likeCount" : "numeric",
                "dislikeCount" : "numeric",
                "favoriteCount" : "numeric",
                "commentCount" : "numeric",
                "duration" : "text",
                "caption" : "text",
                "dimension" : "text",
                "definition" : "text",
                "licensedContent" : "text"
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
def getAllData(url):
    """
        Gets 3 pages of results
        """
    result = []
    original_url = url
    res = _request(url)
    for i in range(3):
        if i != 0:
            res = _request(url)
        result.extend(res['items'])
        try:
            url = original_url + "&pageToken=" + res['nextPageToken']
        except:
            break
    return result
def search(param=False):
    """
        Queries the search endpoint with given params.
        """
    #final result of all the data
    data = []
    key = config.CREDS["YouTube_key"]
    urlparam = {
        "q" : param["query"],
        "key" : key,
        "order": param["order"],
        "maxResults" : 50,
        "type" : "video"
    }
    #search url
    q_url = "https://www.googleapis.com/youtube/v3/search?%s" % (urllib.urlencode(urlparam))
    #video url
    v_url = "https://www.googleapis.com/youtube/v3/videos?key="+key
    snippet_url = q_url + "&part=snippet"
    snip_result = getAllData(snippet_url)
    for res in snip_result:
        row = {}
        row['title'] = res['snippet']['title']
        row['publishedAt'] = res['snippet']['publishedAt']
        id = res['id']['videoId']
        row['id'] = id
        #request to get the statistics for a specific video with its id
        stat_result = _request(v_url+"&id="+id+"&part=statistics")
        stats = stat_result['items']
        row['viewCount'] = stats[0]['statistics']['viewCount']
        row['likeCount'] = stats[0]['statistics']['likeCount']
        row['dislikeCount'] = stats[0]['statistics']['dislikeCount']
        row['favoriteCount'] = stats[0]['statistics']['favoriteCount']
        row['commentCount'] = stats[0]['statistics']['commentCount']
        #request to get the statistics for a specific video with its id
        content_result = _request(v_url+"&id="+id+"&part=contentDetails")
        det = content_result['items']
        row['duration'] = det[0]['contentDetails']['duration']
        row['caption'] = det[0]['contentDetails']['caption']
        row['dimension'] = det[0]['contentDetails']['dimension']
        row['definition'] = det[0]['contentDetails']['definition']
        row['licensedContent'] = det[0]['contentDetails']['licensedContent']
        data.append(row)
    return data