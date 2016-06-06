# Getting Started #

# Development Tools #
Python
------
The majority of SOCRATES is written in Python (for the data collection and analysis and interface to MongoDB). The website sends requests to this Python program, which does most of the heavy lifting.

One good resource is [Learn Python the Hard Way](http://learnpythonthehardway.org/book/index.html). It's a series of short online exercises from the ground up. It's pretty hands-on and probably more fun than a book.

The specific portion of SOCRATES written in Python can be seen here: https://github.com/InfoSeeking/Socrates/tree/master/back-end


MongoDB
-------
MongoDB is used for storing user data (i.e. what data they collect, the results of their analysis, etc.). It isn't being used for anything fancy. It's just simply storing and retrieving "documents" of the user data. There's plenty of online tutorials/documentation on MongoDB usage. Their getting started page (http://docs.mongodb.org/manual/tutorial/getting-started/) may be helpful.


JavaScript/jQuery
-----------------
The user facing front-end of SOCRATES is fairly Javascript intensive. (https://github.com/InfoSeeking/Socrates/tree/master/front-end/js)

It uses the [jQuery library](http://jquery.com/), of which there's an abundance of online resources for learning. One potential introduction is http://jqfundamentals.com/chapter/javascript-basics


Git/GitHub
----------
We're using Git for version control, and the project is being hosted on GitHub. We're not doing anything crazy with Git. The online Git book is a good starting point (http://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository). The book in it's entirety is overkill. If anything, read through the basics.

# Setting Up #

Install the dependencies:

- Python (we are using version 2.7)
- MongoDB
- [PRAW](https://praw.readthedocs.org/en/latest/)
This can be done with `pip install praw`
- [TextBlob](http://textblob.readthedocs.org/en/latest/install.html)
This can be done with `pip install textblob`
- [pymongo](http://api.mongodb.org/python/current/installation.html)
This can be done with `pip install pymongo`
- [Tweepy](https://github.com/tweepy/tweepy)
This can be done with `pip install tweepy`
- SimpleJSON
This can be done with `pip install simplejson`
- [Flask](http://flask.pocoo.org/)
This can be done with `pip install Flask`

Afterwards, download the source from GitHub at https://github.com/kevinAlbs/Socrates

Make sure MongoDB is running. On Ubuntu it runs automatically when installed, on Mac OSX or Windows, you may have to run the command `mongod` to start the MongoDB server.

Rename the [config.py.example](https://github.com/InfoSeeking/Socrates/blob/master/back-end/config.py.example) file to config.py. Put in API keys for the services you need to work with. SOCRATES should run without them, but running the relevant functions will require them.

Running
-------

Once everything is set up, you can run the SOCRATES server with the following simple command

`python socrates.py --serve`

This should start the development server on port 5000. If you go to http://localhost:5000 in your web browser, you should see the SOCRATES website.

<small>Contact Kevin Albertson @kevinAlbs for questions.</small>
