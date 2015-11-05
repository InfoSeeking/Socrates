#SOCRATES
[Live demo of SOCRATES](http://peopleanalytics.org/socrates/)

This document primarily consists of development ideas. To get more information on SOCRATES please visit our [documentation](http://peopleanalytics.org/socrates/docs/)

##Future Goals
### Large Scope
- Plan out infrastructure in cleanest possible way.
	+ Split collection and analysis data to their own Mongo collections. This way, they can refer to each other and chaining multiple datasets will be easier
	+ Add classes for accessing function specs and working_set in python. This will essentially be a python library but no longer have everything rely on the JSON structure
	+ Move visualization to server side to reduce code duplication
- User system for storing/sharing working\_sets
- Long-term data collection campaigns to get around API limits
	- Alternatively, let users add their own API keys
- Maintenance of multiple working\_sets and ability to use multiple working\_sets in visualization
- Extensive documentation, auto-generated from comments and tutorials on creating collection, analysis, and visualization modules
- Set up a virtual\_env for all package installations, maybe make a shell script setup for this
- Make a web interface for accessing logs
- Make specs into objects as opposed to JSON

### Small Scope
- Add logging for front-end errors
- Store visualizations in back-end
- Detect when online in front-end
- Better data and SVG downloading (have visualizations generated in back end)
- Create a cron job to compress logs monthly/yearly

#Ideas
- Have the back-end store data in MongoDB to avoid messaging large datasets back and forth. When a user calls the API for fetching data, it will return the id of the record as well as the data-types and a SINGLE post to see what the data looks like. Then the user can choose which fields to analyze etc.
- Each module will have a single Python file which handles:
	- Specification of whether it is a collection or analysis module and a description
	- Specification of parameters and return values
	- Initial call, it should have a function run(param, working_set) which gets the data
- Cache the working\_set to reduce redundant downloading [done]

#Quick Notes
- Primitive parameters are converted to their actual values, fields are converted to arrays of the entry data they refer to
- Fields defined in the specs for parameters and return values can be either strings or objects

#Issues
- Show all data button not working

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
- field\_reference <data type> (this is from an analysis module which requires a reference to a field)



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
```curl http://localhost:5000/op/collection/twitter/tw_search -d "lang=en&count=1&query=derp"```

Sentiment Analysis:
```curl http://localhost:5000/op/analysis/text/sentiment -d "field=content&reference_id=<ref id>"```