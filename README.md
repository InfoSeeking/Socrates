#SOCRATES
This document primarily consists of development ideas. To get more information on SOCRATES please visit our [documentation](http://peopleanalytics.org/socrates/docs/)

#Future Goals
- Multiple working_sets and user based system
- Integration of Flask into Apache
- Many more modules
- More documentation and video tutorials

#Example Use Cases:
- Seeing sentiment vs. number of followers of tweets
- Seeing the sentiment vs. word_count of the comments in Reddit (there actually is probably somewhat of a correlation)

#Ideas
- Have the back-end store data in MongoDB to avoid messaging large datasets back and forth. When a user calls the API for fetching data, it will return the id of the record as well as the data-types and a SINGLE post to see what the data looks like. Then the user can choose which fields to analyze etc.
- Each module will have a single Python file which handles:
	- Specification of whether it is a collection or analysis module and a description
	- Specification of parameters and return values
	- Initial call, it should have a function run(param, working_set) which gets the data
- Cache the working_set to reduce redundant downloading [done]

#Quick Notes
- Primitive parameters are converted to their actual values, fields are converted to arrays of the entry data they refer to
- Fields defined in the specs for parameters and return values can be either strings or objects

#Issues
- On Chrome locally there is an issue where ajax calls take 15-20 seconds. This does not occur in Firefox. [Edit 3/4/2014 : this is a Chrome bug]
- When I ran an analysis on a data set, a different entry was returned as the first entry (this was with tw_search)
- Total for word count is undefined [3/5/2014 fixed]


#Packages Installed
- PRAW (https://praw.readthedocs.org/en/latest/)
- TextBlob http://textblob.readthedocs.org/en/latest/install.html
- pymongo
- Flask

#Data types for fields
- numeric
- text
- date YYYY-MM-DD hh:mm:ss
- array <data type (not array)>
- boolean
- geo (longitude,latitude)
- field_reference <data type> (this is from an analysis module which requires a reference to a field)



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
