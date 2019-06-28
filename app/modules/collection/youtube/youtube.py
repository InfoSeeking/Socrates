#Version: v3
import csv
import io
import urllib2
import urllib
import urlparse
import config
import youtube_categories
from pprint import pprint
try:
    import simplejson as json
except ImportError:
    import json

SPECS = {
    "functions": {
        "searchVideos": {
            "param_order": ["query", "order"],
            "param": {
                "query": {
                    "type": "text",
                    "comment": "The query for the YouTube search"
                },
                "order": {
                    "type": "text",
                    "constraints": {
                        "choices": ["date", "rating", "relevance", "title", "videoCount", "viewCount"]
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
               # "favoriteCount" : "numeric",
                "commentCount" : "numeric",
                "caption" : "boolean",
             #   'category': 'text',
                "channelTitle" : "text",
                "description": "text"
            }
        },

        "searchComments": {
            "param": {
                "video_ID": {
                    "type": "text",
                    "comment": "Youtube video ID"
                },
                "query": {
                    "type": "text",
                    "comment": "Search term"
                },
                "max_results": {
                    "type": "numeric",
                    "comment": "max number of results",
                    #"optional": True
                },
                "order": {
                    "type": "text",
                    "constraints": {
                        "choices": ["time", "relevance"]
                    }
                },
                "moderation_status": {
                    "type": "text",
                    "constraints": {
                        "choices": ["heldForReview", "likelySpam", "published"]
                    }
                }
            },
            "returns": {
                "content": "text",
                "id": "text",
                "author": "text",
                "like_count": "numeric",
                "time": "text" #???

            }
        }
    }
}

def getOrDefault(arr, key, defaultValue):
    if not key in arr:
        return defaultValue
    else:
        return arr[key]


def formatDuration(s):
    new = s[2:]
    total = 0
    x = -1
    if ("H" in new):
        x = new.find("H")
        myH = int(new[0:x])
        total = myH*3600
    if ("M" in new):
        if x == -1:
            x = new.find("M")
            myM = int(new[0:x])
        else:
            y = new.find("M")
            myM = int(new[x+1:y])
            x = new.find("M")
        total = total + myM*60
    if ("S" in new):
        y = new.find("S")
        myS = int(new[x+1:y])
        total = total + myS
    return float(total)

def _request(url, data=None):
    """
        If data is None, makes a GET request, else makes a POST request
        """
    res = urllib2.urlopen(url, data)
    return json.loads(res.read())

def getAllData(url):
    """
        Gets 2 pages of results
        """
    result = []
    original_url = url
    res = _request(url)
    for i in range(2):
        if i != 0:
            res = _request(url)
        result.extend(res['items'])
        try:
            url = original_url + "&pageToken=" + res['nextPageToken']
        except:
            break
    return result


def searchComments(param):
    key = config.CREDS["YouTube_key"]
    urlparam = {
        "part": "snippet, replies",
        "maxResults": param["max_results"],
        "moderationStatus": param["moderation_status"],
        "order": param["order"],
        "searchTerms": param["query"],
        "key": key,
        "videoId": param["video_ID"],
        "textFormat": "plainText"
    }
    q_url = "https://www.googleapis.com/youtube/v3/commentThreads?%s" % (urllib.urlencode(urlparam))
    result = _request(q_url)
    comments = []
    for c in result["items"]:
        cObj = {
            "content": c["snippet"]["topLevelComment"]["snippet"]["textDisplay"],
            "id": c["snippet"]["topLevelComment"]["id"],
            "author": c["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
            "like_count": c["snippet"]["topLevelComment"]["snippet"]["likeCount"],
            "time": c["snippet"]["topLevelComment"]["snippet"]["publishedAt"]
        }
        comments.append(cObj)
    return comments


def searchVideos(param=False):
    """
        Queries the search endpoint with given params.
        """
    #final result of all the data
    data = []
    key = config.CREDS["YouTube_key"]
    urlparam = {
        "q": param["query"],
        "key": key,
        "order": param["order"],
        "maxResults": 20,
        "type": "video",
    }
    #search url
    q_url = "https://www.googleapis.com/youtube/v3/search?%s" % (urllib.urlencode(urlparam))
    #video url
    v_url = "https://www.googleapis.com/youtube/v3/videos?key="+key
    snippet_url = q_url + "&part=snippet"
    snip_result = getAllData(snippet_url)
    id_list = []
    result_map = {}
    for res in snip_result:
        row = {}
        row['title'] = res['snippet']['title']
        row['description'] = res['snippet']['description']
        row['publishedAt'] = res['snippet']['publishedAt']
        row['channelTitle'] = res['snippet']['channelTitle']
        # row['category'] = youtube_categories.categories[int(res['snippet']['categoryId'])]
        vid = res['id']['videoId']
        row['id'] = vid
        result_map[vid] = row
        id_list.append(vid)

    # Request to get statistics
    #request to get the statistics for a specific video with its id
    reqString = "%s&id=%s&maxResults=20&part=statistics,contentDetails" % (v_url, ','.join(id_list))
    stat_result = getAllData(reqString)

    for res in stat_result:
        vidId = res['id']
        result_map[vidId]['viewCount'] = getOrDefault(res['statistics'], 'viewCount', 0)
        result_map[vidId]['likeCount'] = getOrDefault(res['statistics'], 'likeCount', 0)
        result_map[vidId]['dislikeCount'] = getOrDefault(res['statistics'], 'dislikeCount', 0)
        #result_map[vidId]['favoriteCount'] = getOrDefault(res['statistics'], 'favoriteCount', 0)
        result_map[vidId]['commentCount'] = getOrDefault(res['statistics'], 'commentCount', 0)
        result_map[vidId]['caption'] = getOrDefault(res['contentDetails'], 'caption', '')

    # reqString = "https://www.googleapis.com/youtube/v3/videoCategories?key=%s&id=%s&part=snippet" % (key, ','.join(id_list))
    # category_result = getAllData(reqString)

    # for res in category_result:
    #     vidId = res['id']
    #     result_map[vidId]['category'] = getOrDefault(res['snippet'], 'title', '')

    finalResults = []
    for key in result_map:
        print "key is %s" % key
        finalResults.append(result_map[key])

    return finalResults

    '''
    stats = stat_result['items']
    row['viewCount'] = stats[0]['statistics']['viewCount']
    row['likeCount'] = stats[0]['statistics']['likeCount']
    row['dislikeCount'] = stats[0]['statistics']['dislikeCount']
    row['favoriteCount'] = stats[0]['statistics']['favoriteCount']
    row['commentCount'] = stats[0]['statistics']['commentCount']
        #request to get the statistics for a specific video with its id
        content_result = _request(v_url+"&id="+id+"&part=contentDetails")
        #convert duration string into and int (duration in seconds)
        det = content_result['items']
        s = det[0]['contentDetails']['duration']
        row['duration(sec)'] = formatDuration(s)
        row['caption'] = det[0]['contentDetails']['caption']
        id_snip_result = _request(v_url+"&id="+id+"&part=snippet")
        det = id_snip_result['items']
        row['channelTitle'] = det[0]['snippet']['channelTitle']
        row['category'] = youtube_categories.categories[int(det[0]['snippet']['categoryId'])]
        data.append(row)
    '''
    # return data
