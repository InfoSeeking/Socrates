#Packages Installed
- rauth (https://github.com/reddit/reddit/wiki/OAuth2-Python-Example)
- PRAW (https://praw.readthedocs.org/en/latest/)
- TextBlob http://textblob.readthedocs.org/en/latest/install.html

#Ideas
- Have the back-end store data in MongoDB to avoid messaging large datasets back and forth. When a user calls the API for fetching data, it will return the id of the record as well as the data-types and a SINGLE post to see what the data looks like. Then the user can choose which fields to analyze etc.
