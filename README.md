#Packages Installed
- rauth (https://github.com/reddit/reddit/wiki/OAuth2-Python-Example)
- PRAW (https://praw.readthedocs.org/en/latest/)
- TextBlob http://textblob.readthedocs.org/en/latest/install.html

#Data types for fields
- numeric
- text
- date
- array <data type (not array)>
- boolean
- geo (longitude,latitude)
- field_reference <data type> (this is from an analysis module which requires a reference to a field)

Each field can be appended with a comment starting with // for extra clarification of what it is.
Possibly allow additional fields such as multidimensional arrays (if they will be useful, I'm not sure yet)

#Ideas
- Have the back-end store data in MongoDB to avoid messaging large datasets back and forth. When a user calls the API for fetching data, it will return the id of the record as well as the data-types and a SINGLE post to see what the data looks like. Then the user can choose which fields to analyze etc.

#Issues
- On Chrome locally there is an issue where ajax calls take 15-20 seconds. This does not occur in Firefox.