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
- On Chrome locally there is an issue where ajax calls take 15-20 seconds. This does not occur in Firefox. [Edit 3/4/2014 : this is a Chrome bug]
- When I ran an analysis on a data set, a different entry was returned as the first entry (this was with tw_search)
- Total for word count is undefined

#Analysis

There are two types of results from analysis:
- Per Entry: this will likely be more common and will give a value to each entry in the data set. The analysis data will be directly added to the entry under an analysis property
- Aggregate: a single value describing all of the data (e.g. a sum of all word counts)


Snapshot of JSON after collection and analysis:
```
{
	meta: {}
	data: [{},{},...],
	analysis: [{
		aggregate_analysis: {},
		entry_analysis: [{},{}...],
		entry_meta: {},
		aggregate_meta: {}
	}]
}
```

#TODO:
- figure out how the modules will access and add/modify the working JSON [done]
- add multiple analysis + aggregate [done]
- separate translation.py on per module basis [done]
- implement MongoDB [done]
- get front-end working
	+ Add validation of data
	+ Add option to NOT download entire data set (not necessarily front-end problem)
- add ability to analyze on analysis fields

- Each module will have a single Python file which handles:
	- Specification of whether it is a collection or analysis module and a description
	- Specification of parameters and return values
	- Initial call, it should have a function run(param, working_set) which gets the data

#Useful commands:
Fetch twitter posts:
curl http://localhost:5000/op/collection/twitter/tw_search -d "lang=en&count=1&query=derp"

Sentiment Analysis:
curl http://localhost:5000/op/analysis/text/sentiment -d "field=content&reference_id=<ref id>"