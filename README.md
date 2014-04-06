- Primitive parameters are converted to their actual values, fields are converted to arrays of the entry data they refer to
- Fields defined in the specs for parameters and return values can be either strings or objects

#Currently Working on
- figure out how the modules will access and add/modify the working JSON [done]
- add multiple analysis + aggregate [done]
- separate translation.py on per module basis [done]
- implement MongoDB [done]
- get front-end working
	+ Add validation of data
	+ Add option to NOT download entire data set (not necessarily front-end problem) [done]
- add ability to analyze on analysis fields [done]
- add statistics analysis module [done]
- migrate the modules from context miner [After looking at the scripts, since they heavily depend on MySQL, and I would have to code the bridge between python and PHP, I think it would be easier to recreate the scripts (Youtube, Flickr, Twitter)
- add ability to get multiple sources for visualization modules (might be tricky)
- add documentation
- add ability to visualize on analysis fields (low priority, pretty much copy of back-end portion in JS)
- make sure that errors are handled well in back-end, add logging
- add ability to have objects and nested structures in data (objects within objects, arrays within objects, etc.)
- polish each existing module to include more data/parameters, and the ability to specify the time of the data creation
- add API limits to meta of module specifications, this should facilitate campaign creation later
- Add mod_wsgi and integrate flask with apache
- Add median to stats

#Ideas
- Have the back-end store data in MongoDB to avoid messaging large datasets back and forth. When a user calls the API for fetching data, it will return the id of the record as well as the data-types and a SINGLE post to see what the data looks like. Then the user can choose which fields to analyze etc.
- Each module will have a single Python file which handles:
	- Specification of whether it is a collection or analysis module and a description
	- Specification of parameters and return values
	- Initial call, it should have a function run(param, working_set) which gets the data
- Cache the working_set to reduce redundant downloading [done]

#Issues
- On Chrome locally there is an issue where ajax calls take 15-20 seconds. This does not occur in Firefox. [Edit 3/4/2014 : this is a Chrome bug]
- When I ran an analysis on a data set, a different entry was returned as the first entry (this was with tw_search)
- Total for word count is undefined [3/5/2014 fixed]


#Packages Installed
- rauth (https://github.com/reddit/reddit/wiki/OAuth2-Python-Example)
- PRAW (https://praw.readthedocs.org/en/latest/)
- TextBlob http://textblob.readthedocs.org/en/latest/install.html
- pymongo
- Flask

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

#Useful commands:
Fetch twitter posts:
curl http://localhost:5000/op/collection/twitter/tw_search -d "lang=en&count=1&query=derp"

Sentiment Analysis:
curl http://localhost:5000/op/analysis/text/sentiment -d "field=content&reference_id=<ref id>"
