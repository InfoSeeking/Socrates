#!/usr/bin/python

from rauth import OAuth2Service
from hashlib import sha1
from random import random

import re
import json
import webbrowser
import config

def fetchPosts():
	auth_url = 'https://ssl.reddit.com/api/v1/'
	reddit = OAuth2Service(config.STG['oauth']['reddit']['client_id'], config.STG['oauth']['reddit']['secret'],  authorize_url=auth_url + 'authorize', access_token_url=auth_url + 'access_token', base_url='https://oauth.reddit.com/api/v1/')