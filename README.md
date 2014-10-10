#SOCRATES
[Live demo of SOCRATES](http://peopleanalytics.org/socrates/front-end/)

This document primarily consists of development ideas. To get more information on SOCRATES please visit our [documentation](http://peopleanalytics.org/socrates/docs/)

##Future Goals
###Big Goals
- Plan out infrastructure in cleanest possible way.
- User system for storing/sharing working\_sets
- Long-term data collection campaigns to get around API limits
- Maintenance of multiple working\_sets and ability to use multiple working\_sets in visualization
- Extensive documentation, auto-generated from comments and tutorials on creating collection, analysis, and visualization modules
- Set up a virtual\_env for all package installations, maybe make a shell script setup for this
- Make a web interface for accessing logs

###Small Goals
- Confirm custom data upload works
- Better error management and error logging for front-end
- Detecting when online in front-end
- Better data and SVG downloading (have visualizations generated in back end)
- Code cleaning
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



### Rethinking Structure
Architecture Specifications:
- Easy uploading/downloading of big data
- Easily extensible (or easy to add new collection/analysis/visualization) modules
- Preferably everything in one place (visualization is now almost a separate system, tied to the web)
- Not specific to a web application, since working with large datasets would likely not be feasible to be uploaded
- Eventual integration with Hadoop


Ideas:
- Provide a library for clients
