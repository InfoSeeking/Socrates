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
We're using Git for version control, and the project is being hosted on GitHub. We're not doing anything crazy with Git. The online Git book is a good starting point (http://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository). The book in it's entirety is overkill. If anything, read through the basics. I can likely just show you the commands you'll be using on a daily basis.

# Setting Up #

Install the dependencies:

- ["AMP" Apache - MySQL - PHP](https://www.apachefriends.org/index.html)
- Python (we are using version 2.7.3)
- MongoDB (we are using version 2.4.9)
- [PRAW](https://praw.readthedocs.org/en/latest/)
This can be done with `pip install praw`
- [TextBlob](http://textblob.readthedocs.org/en/latest/install.html)
This can be done with `pip install textblob`
- [pymongo](http://api.mongodb.org/python/current/installation.html)
- [Tweepy](https://github.com/tweepy/tweepy)
This can be done with `pip install tweepy`
- [MySQL driver for Python](http://sourceforge.net/projects/mysql-python/)
This can be installed with `pip install MySQL-python`. If you are using MariaDB, you may need to install an additional package ('yum install mariadb-devel')
- SimpleJSON
This can be done with `pip install simplejson`

Afterwards, download the source from GitHub at https://github.com/kevinAlbs/Socrates

Make sure the directory is lowercase, e.g. socrates, not Socrates. Place it directly in your Apache web root (likely named htdocs). 

In MySQL, create an empty database to be used for storing users/log data. Then, import the database table schemas in [db.sql](https://github.com/InfoSeeking/Socrates/blob/master/back-end/db.sql). You can do this in phpMyAdmin or another GUI environment, or simpley run in command line the following:

`mysql -u=user -p=password socrates-db < db.sql`

Rename the [config.py.example](https://github.com/InfoSeeking/Socrates/blob/master/back-end/config.py.example) file to config.py and put in your MySQL credentials.


If I wrote this getting started page correctly (which is nearly impossible) and all went well (which is nearly impossible) you can navigate to http://localhost/Socrates/front-end and see a your local copy running.

Contact Kevin Albertson @kevinAlbs for questions.
