<?php 
include("inc/top_1.php"); 
$PG_NAME = "Development Overview";
$PG_ID = "overview";
?>
  <style type="text/css">
  </style>

<?php
include("inc/top_2.php");
?>
  		<h2>Setting up SOCRATES locally</h2>
  		<p>Install the dependencies:</p>
  		<ul>
  			<li>Python (we are using version 1.7.3)</li>
  			<li>MongoDB (we are using version 2.4.9)</li>
  			<li>PRAW <a href="https://praw.readthedocs.org/en/latest/" target="_blank">https://praw.readthedocs.org/en/latest/</a></li>
  			<li>TextBlob <a href="http://textblob.readthedocs.org/en/latest/install.html" target="_blank">http://textblob.readthedocs.org/en/latest/install.html</a></li>
  			<li>pymongo <a href="http://api.mongodb.org/python/current/installation.html" target="_blank">http://api.mongodb.org/python/current/installation.html</a></li>
  			<li>Flask <a href="http://flask.pocoo.org/docs/installation/" target="_blank">http://flask.pocoo.org/docs/installation/</a></li>
  			<li>Tweepy<a href="https://github.com/tweepy/tweepy" target="_blank">https://github.com/tweepy/tweepy</a></li>
  		</ul>
  		<p>Afterwards, download the source from GitHub at <a href="https://github.com/kevinAlbs/Socrates" target="_blank">https://github.com/kevinAlbs/Socrates</a></p>
  		<p>The directories containing the code are front-end and back-end. Put the directory named front-end somewhere in your web root (i.e. htdocs or public_html). For example, my web root is located in my home directory in public_html in /home/kevin/public_html. So I created a subdirectory named socrates and moved the front-end directory there. The back-end directory can remain elsewhere.</p>
  		<p>At this point you should have the following</p>
  		<ul>
  			<li>The dependencies listed above installed</li>
  			<li>The front-end directory located in your local web server's root</li>
  		</ul>
  		<p>Now before you navigate to the front-end, you must run the back-end Flask server to receive requests from the front-end. The default settings in the back-end may be sufficient, but depending on your installation of MongoDB you may have to change the connection code.<br/>
  		Under back-end/wsgi.py you should see the line:</p>
  		<pre>client = MongoClient()</pre>
  		<p>This can be changed according to the <a href="http://api.mongodb.org/python/current/tutorial.html" target="_blank">pymongo docs</a> to include any credentials you have (if any).</p>
  		<p>Now try running the back-end Flask server with the following (in the back-end directory)</p>
  		<pre>python wsgi.py</pre>
  		<p>Once it is running, try navigating to the front-end directory in your web browser.</p>
  		<p>NOTE: If you are using Chrome, try using Incognito. Due to the way Chrome caches requests, the AJAX requests from the front-end sometimes take 10-15 seconds if you are not using Incognito.</p>
  		<h2>Collection, Analysis, and Exploration</h2>
  		<p>These are the main three components of SOCRATES. Both Analysis and Collection are completely handled in the back-end while Exploration (visualization) is handled in the front-end (with D3.js)</p>
  		<h3>Collection</h3>
  		<p>Simply enough, collection requests utilize social media API's to fetch data. This data is assumed to be in a list (a list of posts, friends, etc.).</p>
  		<h3>Analysis</h3>
  		<p>An analysis can be performed on collection data and other analysis data. An analysis can output two kinds of data: entry-data and aggregate-data.</p>
  		<h4>Entry-Data</h4>
  		<p>Entry-Data consists of a list of equal length as the collection data. This data corresponds directly with each individual entry in the collection data. For example, suppose our collection data consists of a list of tweets. We can do a word count analysis on the content of the tweets. This will return word counts for each individual tweet.</p>
  		<h4>Aggregate-Data</h4>
  		<p>Aggregate-Data consists of single valued data. For example, if I want to get statistics on the followers of tweets, I would perform a statistics analysis on the collection of tweets. This would return aggregate-data describing the average, standard deviation, etc. Notice, these are single values (as opposed to the entry data corresponding to each individual tweet).</p>

  		<h2>Back-End</h2>
  		<p>The back-end is written in Python and data is managed with MongoDB. The main tasks of the back-end are to collect data from social media sources (storing the resulting data in MongoDB) and perform analyses on that data. Because most API's return JSON and MongoDB works well with JSON all data sets are in JSON.</p>
  		<p>The back-end is responsible for:</p>
  		<ul>
  			<li>Storing and retreiving <a href="#working-set">working sets</a></li>
  			<li>Validation of parameters sent from user</li>
  			<li>Processing requests for analysis functions</li>
  			<li>Processing requests for exploration (visualization) functions</li>
  		</ul>
  		<h3 id="working-set">What is a Working Set?</h3>
  		<p>The working set is the user's primary data storage. It is a single JSON object containing the data results for collection, analysis (possibly many), visualization (coming soon), metadata of each of those components, and additional non-essential data such as a reference to the database entry in MongoDB.</p>

  		<pre class='view'>
{
	data: [
		//collection data, this is an array of separate items from the collection source. 
		//E.g. this could be an array of 200 tweets from Twitter.
	]
	meta: {
		//meta contains information regarding the collection data
	}

	analysis: [
		//Notice, this is an array since you can do multiple analyses
		{
			//first analysis data
			//as described above, aggregate data is single valued
			aggregate_analysis: {}, 
			entry_analysis: {}, //entry data corresponds directly to each entry
			aggregate_meta: {}, //metadata describing data of aggregate
			entry_meta: {}
		},
		{
			//second analysis data
		}
		//and so on...
	]
}
  		</pre>
  		<h4>Design Decisions for Working Sets</h4>
  		<p>As a note, this section can be skipped without any loss in understanding.</p>
  		<p>A working set can only contain data from ONE collection source. This is to avoid the following situation. Say you collect data from Twitter and Youtube from the same user. Twitter may return 100 tweets and Youtube may return 200 entries on video data. If I want to analyze say the difference in followers from the tweets against the number of likes in the video data (an analysis). Since there are 100 more Youtube entries than Twitter, what happens to the 100 extra entries? Analysis on two separate collection data sets doesn't make sense unless both data sets have exactly the same number of entries. Therefore, as of now, we decided to limit a working set to only one collection data set at a time.</p>
  		<p>However, we do think that visualization of multiple data sets is useful. (E.g. you could see a scatterplot of likes vs. views on multiple Youtube data sets of differing length). Therefore, we are planning to allow Visualization functions to import data from separate working sets</p>
  
<?php include("inc/bottom.php"); ?>
