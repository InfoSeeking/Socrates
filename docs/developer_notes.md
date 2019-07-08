# Developer Notes #

The following notes are for developers who wish to understand the structure of the code to further develop SOCRATES.

To determine how to set up SOCRATES on your machine, please refer to the [getting started](docs/getting_started.md) documentation.

------

# Folder Structure # 

An overview and brief summary of the folder structure.

- **app/example_params**: Example templates of JSON input to the SOCRATES app.
- **app/logs**: Can be used to log Flask errors (as .log files). Not used in dev.
- **app/modules**: Python code for analysis and collection modules code goes here.
- **app/parameters**: Make sure this directory is write-accessible from apache on Socrates' server. Example JSON input to the SOCRATES app.
- **app/static**: Static CSS, JS, and HTML files. `static/js/custom` contains custom JS specifically made for this project. Also contains the `config.json` that must be modified to run this application.
- **app/config.py**: Must be modified to run this application.
- **app/templates**: Templated HTML files, templated using the Jinja framework.
- **app/tmp**: Not currently used.
- **docs**: Documentation for this project. Read this documentation to learn how to get started on installing, running, and extending the SOCRATES tool.


# Analysis Modules #

Modules are folders consisting of the following components
- `modulename/`: The folder with the same name as the module
- `modulename/__init__.py`: The init file for this folder. Contains a single statement `from modulename import *`
- `modulename/modulename.py`: The main module.

The main module `modulename.py` is structured as follows:
- `SPECS`: A dictionary object containing specifications read and parsed by the front end (`translation.py` and `Visualization.js`).
- `def function_name(working_set, param=False)` - Definition of each function supported by this module.  Assumes a `working_set` as input and optional parameters specific to the function. See the below description of the `SPECS` object. Expected output is a JSON object with a top level key of `entry_result` or `aggregate_result`

The `SPECS` object in each module is formatted as follows.  First, it contains two top level keys: `description` and `functions`. The value of `description` is a human-readable string which describes the module. The value of functions `functions` is a dictionary for the functions.  Specifically, each key is named `fn_name`, where `fn_name` corresponds to one of the python functions in the module.  The keys for this function are as follows:

- `param_order`: The order of the parameters in the front-facing UI.
- `param`: A dictionary containing a key for each param (its name, and the values are key-value pairs for `type` (the type of form entry) and `comment` (a human-readable string)).
- `entry_result`: if an entry result, a dictionary key-value pairs of results and their types, for instance `'avg_word_count':'numeric'`.
- `aggregate_result`: if an aggregate result, a dictionary key-value pairs of results and their types, for instance `'avg_word_count':'numeric'`. 

The current modules are as follows:

- **stats**: Provides functions for statistical analysis. Includes mathematical expression evalution, descriptive statistics, correlation, and regression
- **text**: Provides functions for textual analysis. Includes word count and sentiment analysis.

# Collection Modules #

Modules are folders consisting of the following components
- `modulename/`: The folder with the same name as the module
- `modulename/__init__.py`: The init file for this folder. Contains a single statement `from modulename import *`
- `modulename/modulename.py`: The main module.

The main module `modulename.py` is structured as follows:
- `SPECS`: A dictionary object containing specifications read and parsed by the front end (`translation.py` and `Visualization.js`).
- `def function_name(param)` - Definition of each function supported by this module.  Assumes `param` as input to the function, a dictionary in which the form depends on the function. See the below description of the `SPECS` object. Expected output is a JSON object with a top level key of `entry_result` or `aggregate_result`

The `SPECS` object in each module is formatted as follows.  First, it contains two top level keys: `description` and `functions`. The value of `description` is a human-readable string which describes the module. The value of functions `functions` is a dictionary for the functions.  Specifically, each key is named `fn_name`, where `fn_name` corresponds to one of the python functions in the module.  The keys for this function are as follows:

- `param_order`: The order of the parameters in the front-facing UI.
- `param`: A dictionary containing a key for each param (its name, and the values are key-value pairs for `type` (the type of form entry), `comment` (a human-readable string), `constraints` (`choices` as a list of strings for a limited list of options), `default` (a default number for numeric entries), and `optional` (whether the entry is optional. defaults to `False` if not present)).
- `returns`: key-value pairs indicating the name of the variable returned and its data type, for instance `'id':'numeric'` or `'authorname':'text'`. 

The current modules are as follows:

- **facebook**: Support temporarily discontinued. Additional support for this is TBD.
- **flickr**: Fetches photo comments from Flickr
- **nytimes**: Fetches the comments on a specific article and also performs article search
- **reddit**: Fetches the comments on a specific post. Also fetches the posts of a specific subreddit
- **twitter**: Performs a general text search in Twitter
- **youtube**: Searches videos and comments for specified text.

These modules rely on the configuration specified in `config.py`. If you require an API key to access an API, you must specify that key in `config.py`. You can then access it in your module through the `config.CREDS` object.  It is up to you to download the specific Python library to access your API of choice or to properly format the URL to access the API.

# Database Schema #

The following is an overview of each table in the MongoDB database, including

- **log**: A log of workspace-related actions.  Keys are: `namespace` (current value is `'run'`), `type` (`'collection'` or `'analysis''`), `module` (the name of the module - e.g. `'twitter'`), `function` (the name of the function - e.g. `'twitter_search''`), and `user_id` (the user's ID)
- **users**: The users.  Keys are:`_id` (the user's ID, which is unique), `username` (the username), `hashed_password` (The SHA1-encrypted version of the password.) 
- **working_set**: Each working set that has been run.  Used to store, retrieve, and share working sets. Keys are: `_id` (the working set's ID), `user_id` (the user ID of the creator), `analysis` (if an analysis was done, contains the results of the analysis), `meta` (contains column names for the data), `input` (contains the inputs that generated the data), `working_set_id` (same as `_id`), and `data` (the data, with columns corresponding to `meta`)


# External API References #

The following are external JS libraries used here (found in `app/static/js/external`):

- [Bootstrap](https://getbootstrap.com/) - To create a flexible, extensible UI.
- [Chart.js](https://www.chartjs.org/) - To support visualizations of analyses and explorations. 
- [d3.js](https://d3js.org/) - To support visualizations of analyses and explorations.
- [download.js](http://danml.com/download.html) - To support the download of workflows as files.
- [jQuery](https://jquery.com/) - To simplify JS code


<small>Contact Kevin Albertson @kevinAlbs for questions.</small>
