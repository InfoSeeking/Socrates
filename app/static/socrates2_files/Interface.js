/**
 * Created by Anastasia Ryssiouk on 6/29/15.
 */
$(document).ready(function() {
    var currentMedia = new Array();
    var twitter = new Array(), youtube = new Array(), nyt = new Array(), reddit = new Array(), fb = new Array(), flickr = new Array();
    var myMedia = new Array(), myGraphs = new Array();

    var moduleInfo = {
        'analysis': {
            'sentiment': {
                key: 'sentiment',
                name: 'Sentiment',
                description: 'Polarity and subjectivity of a corpus'
            },
            'word_count': {
                key: 'word_count',
                name: 'Word Counts',
                description: 'Get individual word counts of a corpus'
            },
            'correlation': {
                key: 'correlation',
                name: 'Correlation',
                description: 'Get the correlation coefficient between two variables'
            },
            'regression': {
                key: 'regression',
                name: 'Linear Regression',
                description: 'Get the coefficients for the best-fit line'
            },
            'basic': {
                key: 'basic',
                name: 'Basic Statistics',
                description: 'Get basic statistics like the average and median'
            }
        },
        'collection': {
            'twitter': {
                key: 'twitter', name: 'Twitter', description: ''
            },
            'facebook': {
                key: 'facebook', name: 'Facebook', description: ''
            },
            'ny_times': {
                key: 'ny_times', name: 'NY Times', description: ''
            },
            'youtube': {
                key: 'youtube', name: 'YouTube', description: ''
            },
            'reddit': {
                key: 'reddit', name: 'Reddit', description: ''
            }
        },
        'exploration': {
            'histogram' : {
                key: 'histogram',
                name: 'Histogram',
                description: ''
            },
            'scatterplot': {
                key: 'scatterplot',
                name: 'Scatterplot',
                description: 'Show datapoints on an X/Y plot'
            },
            'piechart' : {
                key: 'piechart',
                name: 'Pie Chart',
                description: 'For discrete valued variables'
            },
            'regression' : {
                key: 'regression',
                name: 'Linear Regression',
                description: 'A scatterplot with a best fit line'
            }
        }
    };

    myMedia[0] = ["twitter", "youtube", "ny_times", "facebook", "reddit"];
    myGraphs[0] = ["histogram", "scatterplot", "piechart", "regression"];   
    twitter["analysis"] = ["sentiment", "word_count", "correlation", "regression", "basic"];
    twitter["analysisText"] = [
        {"key": "content", "name": "Text content"},
        {"key": "tweet_id", "name": "Tweet ID"},
        {"key": "created", "name": "Date created"},
        {"key": "authorloc", "name": "Author location"},
        {"key": "username", "name": "Username"}, 
        {"key": "source", "name": "Source"},
        {"key": "authorid", "name": "Author ID"}
    ];
    twitter["analysisStat"] = [
        {"key": "friends", "name": "Friend count"},
        {"key": "followers", "name": "Follower count"},
        {"key": "retwc", "name": "Retweet count"}
    ];
    twitter["tPic"] = "front-end/img/twitter_text.png";
    twitter["statPic"] = "front-end/img/twitter_stat.png";

    youtube["analysis"] = ["sentiment", "word_count", "correlation", "regression", "basic"];
    youtube["analysisStat"] = [
        {"key": "dislikeCount", "name": "Dislike count"}, 
        {"key": "likeCount", "name": "Like count"},
        {"key": "commentCount", "name": "Comment count"},
        {"key": "viewCount", "name": "View count"}, 
        {"key": "favoriteCount", "name": "Favorite count"}
    ];
    youtube["analysisText"] = [
        {"key": "publishedAt", "name": "Date published"},
        {"key": "id", "name": "Video ID"},
        {"key": "channelTitle", "name": "Channel Title"},
        {"key": "title", "name": "Video Title"},
        {"key": "description", "name": "Video Description"}
    ];
    youtube["sorting"] = [ "relevance", "date", "rating", "title", "videoCount", "viewCount"];
    youtube["textPic"] = "front-end/img/youtube_text.png";
    youtube["statPic"] = "front-end/img/youtube_stat.png";

    //FIX word_count
    nyt["analysis"] = ["sentiment", "basic"];
    nyt["analysisText"] = [
        {"key": "lead_paragraph", "name": "Lead paragraph"},
        {"key": "headline", "name": "Headline"},
        {"key": "abstract", "name": "Abstract"},
        {"key": "snippet", "name": "Snippet"},
        {"key": "web_url", "name": "URL"}
    ];
    nyt["analysisStat"] = [
        {"key": "word_count", "name": "Word count"}
    ];
    nyt["sorting"] = ["newest",  "oldest"];
    nyt["textPic"] = "front-end/img/nyt_text.png";
    nyt["statPic"] = "front-end/img/nyt_stat.png";

    reddit["analysis"] = ["sentiment",  "word_count",  "correlation",  "regression",  "basic"];
    reddit["analysisText"] = [
        {"key": "content", "name": "Content"},
        {"key": "user", "name": "Username"},
        {"key": "id", "name": "Post ID"},
        {"key": "title", "name": "Title"}, 
        {"key": "url", "name": "URL"},
        {"key": "domain", "name": "Domain"}
    ];
    reddit["analysisStat"] = [
        {"key": "downvotes", "name": "Downvote count"}, 
        {"key": "upvotes", "name": "Upvote count"}, 
        {"key": "created_utc", "name": "Date created"}
    ];
    reddit["sorting"] = ["hot",  "new",  "rising",  "controversial",  "top"];
    reddit["textPic"] = "front-end/img/reddit_text.png";
    reddit["statPic"] = "front-end/img/reddit_stat.png";

    fb["analysis"] = ["sentiment",  "word_count"];
    fb["analysisText"] = [
        {"key": "category", "name": "Category"},
        {"key": "name", "name": "Name"}];
    fb["textPic"] = "front-end/img/fb_text";

    //Not finished
    flickr["analysis"] = [ "sentiment",  "word_count",  "correlation",  "regression",  "basic"];

    var count = 25, numsplits = 10, subreddit, sorting;
    var query = "", media = "", analysis = "", exploration = "";
    var mediaArr = new Array(), analysisArr = new Array(), expArr = new Array();
    var analysisParam = new Array(), expParam = new Array();
    var hasTwoFields = false, isDataGotten = false;
    var myData, params;
    var browser;
    var setName = "Untitled";
    var header1 = "1. What topic you are interested in?";
    var header2 = "2. Where would you like to get the data from?";
    var header3 = "3. What would you like to do with the data you collect about these topics?";
    var header4 = "4. Pick parameters for analysis";
    var header5 = "Research Statement";
    var header6 = "5. What kind of graph would you like to explore?";
    var header7 = "6. What kind of parameter(s) would you like to use?";
    var smHeader1 = "Please type one or more words:";
    var smHeader2 = "The social media sources available to you are (choose one):";
    var smHeader3 = "The analysis modules available to you are:";
    $("#social, #interfaceAnalysis, #interfaceWorkflow, #interfaceNext1, #interfaceNext2, " +
        "#interfaceBack, #interfaceInput, #interfaceDone, #interfaceExecute, #count, #interfaceExp, " +
        "#numSplits, #interfaceExpResults, #redditSub, #sortOptions").hide();
    $("#interfaceReset").click(reset);
    $("#resetBtn").click(reset);
    $("#expResetBtn").click(showResearchState);
    $("#showResearchState").click(showResearchState);
    $("#getSuggestions").click(q1);
    $("#interfaceNext1").click(q2);
    $(".explorationBtn").click(q5);
    //$("#getExpBtn").click(getVisualization);
    $("#renameSet").click(getRenameInput);
    //Question 1: asks about query
    function q1(){
        if (UI.isLoggedIn()) {
        //if (true){
            $("#interfaceInfo, #interfaceWorkflow, #count").hide();
            $(this).hide();
            $(this).parent().hide();
            $("#interfaceNext1").fadeIn();
            $("#mainHeader").text(header1);
            $("#smallerHeader").text(smHeader1);
            $("#interfaceInput, #interfaceInputContainer").fadeIn();
        }else{
            alert("Please log in");
        }
    }
    //Questions 2: asks about social media
    function q2(){
        $("#interfaceNext2").text("Next");
        //query = document.getElementById("interfaceInput").value;
        query = $("#interfaceInput").val();
        if (query == "") {
            alert("Please enter keyword(s)");
        }else {
            $(this).hide();
            getCircleBtns("social", myMedia[0], 'collection');
            $("#interfaceNext2, #interfaceBack, #social, #count").fadeIn();
            $("#interfaceInput, #interfaceInputContainer, #interfaceNext1,#interfaceWorkflow, #redditSub, #sortOptions").hide();
            $("#mainHeader").text(header2);
            $("#smallerHeader").text(smHeader2);
        }
    }
    //Questions 3: asks about analysis, dependant on social media chosen
    function q3(){
        //count = document.getElementById("countInput").value;
        count = $("#countInput").val();
        if(mediaArr.length !== 1) {
            alert("Please select one social media");
        }else {
            media = mediaArr[0];
            if (media == "reddit") {
                $("#redditSub").fadeIn();
            }
            $("#interfaceNext2").text("Next");
            $("#interfaceAnalysis, #interfaceNext2").fadeIn();
            $("#mainHeader").text(header3);
            $("#smallerHeader").text(smHeader3);
            $("#social, #interfaceWorkflow, #count").hide();
            currentMedia = getMedia(media);
            console.log('Got media', currentMedia);
            if (getSorting(currentMedia["sorting"])) {
                $("#sortOptions").fadeIn();
            }
            getCircleBtns("interfaceAnalysis", currentMedia["analysis"], 'analysis');
        }
    }
    //Question 4: asks about analysis parameters specific to social media and analysis
    function q4(){
        subreddit = $("#subreddit").val();
        if (analysisArr.length !== 1 || ((subreddit == "" || !subreddit) && media == "reddit")) {
            if (analysisArr.length !== 1) {
                alert("Please select one analysis.");
            }else {
                alert("Please enter a subreddit.");
            }
        }else{
            analysis = analysisArr[0];
            if (media == "reddit"){
                subreddit = $("#subreddit").val();
            }
            sorting = $("#sorting").val();
            $("#mainHeader").text(header4);
            $("#interfaceAnalysis, #interfaceWorkflow, #redditSub, #sortOptions").hide();
            $("#interfaceAnalysisOptions, #interfaceNext2").fadeIn();
            $("#interfaceAnalysisOptions").empty();
            $("#interfaceNext2").text("Finish");
            var src;
            var image;
            if (isTextAnalysis(analysis)){
                src = currentMedia["textPic"];
            }else {
                src = currentMedia["statPic"];
            }
            image = "<br><br><img src="+src+">";
            if (isTextAnalysis(analysis) || analysis == "basic") {
                hasTwoFields = false;
                $("#smallerHeader").text("Please select a field to perform the analysis:");
                $("#interfaceAnalysisOptions").append($("<h4>Field:</h4>"));
                getAnalysisParams();
                //$("#interfaceAnalysisOptions").append(image);
            } else {
                hasTwoFields = true;
                $("#smallerHeader").text("Please select fields to perform the analysis:");
                $("#interfaceAnalysisOptions").append($("<h4>field_1:</h4>"));
                getAnalysisParams();
                $("#interfaceAnalysisOptions").append($("<h4>field_2:</h4>"));
                getAnalysisParams();
                //$("#interfaceAnalysisOptions").append(image);
            }
        }
        var d = new Date();
        setName = String(media+"_"+analysis+"_"+d.toDateString());
    }
    //Question 5: which exploration
    function q5(){
        $("#interfaceWorkflow, #interfaceExpOptions, #numSplits, #sortOptions, #interfaceExecute, #finalResult").hide();
        $("#interfaceNext2").text("Next");
        $("#smallerHeader").text("");
        getCircleBtns("interfaceExp", myGraphs[0], 'exploration');
        $("#interfaceNext2, #interfaceBack, #interfaceExp").fadeIn();
        $("#mainHeader").text(header6);
    }
    //Question 6: which params for exploration
    function q6(){
        if (expArr.length !== 1) {
            alert("Please select one graph");
        }else {
            $("#interfaceExpOptions").empty();
            exploration = expArr[0];
            $("#interfaceExp").hide();
            $("#interfaceExpOptions").fadeIn();
            $("#interfaceNext2").text("Finish");
            $("#mainHeader").text(header7);
            $("#smallerHeader").text("");
            if (exploration == "piechart") {
                hasTwoFields = false;
                $("#smallerHeader").text("Please select a parameter for this field:");
                $("#interfaceExpOptions").append($("<h4>field:</h4>"));
                getExpParams(exploration);
            } else if (exploration == "histogram"){
                hasTwoFields = false;
                $("#smallerHeader").text("Please select a parameter for this field:");
                $("#interfaceExpOptions").append($("<h4>field:</h4>"));
                getExpParams(exploration);
                $("#numSplits").fadeIn();
            } else {
                hasTwoFields = true;
                $("#smallerHeader").text("Please select a parameter for x_field and y_field:");
                $("#interfaceExpOptions").append($("<h4>x_field:</h4>"));
                getExpParams(exploration);
                $("#interfaceExpOptions").append($("<h4>y_field:</h4>"));
                getExpParams(exploration);
            }
        }
    }
    //Takes care of color change when a circle button is selected/unselected and saves selected value
    function circleBtns() {
        var isOrange = false;
        $(this).toggleClass('active');
        isOrange = $(this).hasClass('active');
        var key = $(this).attr('data-key');
        console.log('Button key is ' , key);
        var index;
        if($("#social").is(":visible") && isOrange){
            mediaArr.push(key);
        }else if ($("#social").is(":visible") && !isOrange) {
            index = mediaArr.indexOf(key);
            if (index !== -1) {
                mediaArr.splice(index,1);
            }
        }else if ($("#interfaceAnalysis").is(":visible") && isOrange){
            analysisArr.push(key);
        }else if ($("#interfaceAnalysis").is(":visible") && !isOrange) {
            index = analysisArr.indexOf(key);
            if (index !== -1) {
                analysisArr.splice(index,1);
            }
        }else if ($("#interfaceExp").is(":visible") && isOrange){
            expArr.push(key);
        }else if ($("#interfaceExp").is(":visible") && !isOrange) {
            index = expArr.indexOf(key);
            if (index !== -1) {
                expArr.splice(index,1);
            }
        }
    }
    //Creates circle buttons with in id(html div) with content of arr
    function getCircleBtns(id, arr, moduleType){
        var ID = "#"+id;
        if ($(ID).html() == "") {
            var count = 0;
            for (var i = 0; i < arr.length; i++) {
                console.log(arr[i], moduleType);
                var key = arr[i];
                var info = moduleInfo[moduleType][key];
                var btn = $("<div class='circle-btn' data-key='" + info.key + "'>" + info.name + "</div>").click(circleBtns);
                var container = $("<div class='circle-btn-container'></div>");
                container.append(btn);
                container.append("<div class='description'>" + info.description + "</div>");
                $(ID).append(container);
            }
        }
    }
    function getMedia(myMedia){
        var arr = new Array();
        switch (myMedia) {
            case "twitter":
                arr = twitter;
                break;
            case "youtube":
                arr = youtube;
                break;
            case "reddit":
                arr = reddit;
                break;
            case "ny_times":
                arr = nyt;
                break;
            case "flickr":
                arr = flickr;
                break;
            case "facebook":
                arr = fb;
                break;
        }
        return arr;
    }
    //Set up analysis param buttons
    function getAnalysisParams() {
        var count = 0;
        var arr;
        var temp;
        analysisParam = new Array();
        if (isTextAnalysis(analysis)) {
            arr = currentMedia["analysisText"];
        }else {
            arr = currentMedia["analysisStat"];
        }
        for(var i = 0; i < arr.length; i++) {
            var param = arr[i];
            var btn = $("<button class='button' data-key='" + param.key + "'>"+ param.name +"</button>").click(analysisParamBtn);
            $("#interfaceAnalysisOptions").append(btn);
        }       
    }
    function isTextAnalysis(param) {
        if (param == "sentiment" || param == "word_count") {
            return true;
        }else {
            return false;
        }
    }
    function analysisParamBtn() {
        var text = $(this).attr('data-key');
        if(analysisParam.indexOf(text) == -1 && !$(this).hasClass("red")) {
            analysisParam.push(text);
        }else if(($(this).hasClass("red"))){
            var index = analysisParam.indexOf(text);
            if(index != -1){
                analysisParam.splice(index, 1);
            }
        }
        $(this).toggleClass("red");
    }
    function getExpParams(exp){
        var count = 0;
        var arr;
        var temp;
        expParam = new Array();
        if (isTextExp(exp)) {
            arr = currentMedia["analysisText"];
        }else {
            arr = currentMedia["analysisStat"];
        }
        while(true) {
            temp = arr[count];
            var btn;
            if (temp != null) {
                btn = $("<button class='button' data-key='" + temp.key + "'>"+temp.name+"</button>").click(expParamBtn);
                $("#interfaceExpOptions").append(btn);
                count++;
            } else {
                break;
            }
        }
    }
    function isTextExp(param) {
        if (param == "piechart") {
            return true;
        }else {
            return false;
        }
    }
    function expParamBtn(){
        var text = $(this).attr('data-key');
        if(expParam.indexOf(text) == -1 && !$(this).hasClass("red")) {
            expParam.push(text);
        }else if(($(this).hasClass("red"))){
            var index = expParam.indexOf(text);
            if(index != -1){
                expParam.splice(index, 1);
            }
        }
        $(this).toggleClass("red");
    }
    function getSorting(list){
        if (list) {
            var temp = list;
            var options = "";
            var i;
            for (i in temp) {
                options +="<option value="+temp[i]+">"+temp[i]+"</option>";
            }
            $("#sorting").html(options);
            return true;
        }else{
            return false;
        }
    }
    $("#interfaceNext2").click(function() {
        var text = $("#mainHeader").text();
        switch (text){
            case (header2):
                q3();
                break;
            case (header3):
                q4();
                break;
            case (header4):
                showWorkflow(false);
                break;
            case (header6):
                q6();
                break;
            case (header7):
                //exploration results "page"
                numsplits = $("#numSplitCount").val();
                if(((hasTwoFields && expParam.length != 2) || (!hasTwoFields && expParam.length != 1))) {
                    if(hasTwoFields){
                        alert("Please select two parameters.");
                    }else {
                        alert("Please select one parameter.");
                    }
                }else {
                    $("#interfaceExpOptions, #interfaceBack, #interfaceNext2, #numSplits").hide();
                    $("#mainHeader").text("Exploration Results");
                    $("#smallerHeader").text("Showing dataset: "+ setName);
                    $("#interfaceExpResults").fadeIn();
                    getDataParams(getVisualization);
                    break;
                }
        }
    });
    function showWorkflow(isBack) {
        if(((hasTwoFields && analysisParam.length != 2) || (!hasTwoFields && analysisParam.length != 1)) && !isBack) {
            if(hasTwoFields){
                alert("Please select two parameters.");
            }else {
                alert("Please select one parameter.");
            }
        }else {
            $("#interfaceAnalysis, #interfaceNext2, #interfaceBack,#interfaceAnalysisOptions").hide();
            $("#smallerHeader").text("");
            $("#mainHeader").text(header5);
            var interest;
            if (media !== "reddit") {
                interest = query;
            }else{
                interest = subreddit;
            }
            $("#BeatsResults").html("I'm interested in <b>" + interest + "</b> <button class='interfaceEdit' id='edit1'>edit</button><br>" +
                "I want to use <b>" + media + "</b> (count "+count+"), <button class='interfaceEdit' id='edit2'>edit</button><br>" +
                "I want to analyze <b>" + analysis + "</b>, <button class='interfaceEdit' id='edit3'>edit</button><br> " +
                "Using <b>" + analysisParam.toString() + ". <button class='interfaceEdit' id='edit4'>edit</button>");
            $("#interfaceWorkflow").fadeIn();
            $("#edit1").click(q1);
            $("#edit2").click(q2);
            $("#edit3").click(q3);
            $("#edit4").click(q4);
        }
    };
    $("#interfaceBack").click(function() {
       text = $("#mainHeader").text();
       if(text.indexOf("3") != -1) {
           $("#interfaceAnalysis, #interfaceInput").hide();
           mediaArr = new Array();
           $("#social").html("");
           q2();
       }else if(text.indexOf("2") != -1){
           $("#social, #interfaceNext2, #interfaceBack").hide();
           q1();
       } else if (text.indexOf("4") != -1){
           $("#interfaceAnalysisOptions").hide();
           q3();
       } else if (text.indexOf("5") != -1) {
           $("#interfaceExp").hide();
           $("#BeatsResults").fadeIn();
           showWorkflow(true);
       } else if (text.indexOf("6") != -1){
            q5();
       }
    });
    function reset(){
        window.location.href = "socrates2.html";
    }
    function showResearchState(){
        $("#interfaceExpResults, #finalResult, #DatasetRename, #interfaceExecute").hide();
        $("#BeatsResults").html("");
        showWorkflow(true);
        $("#finalResult").empty();
    }
    $("#interfaceExecuteBtn").click(function(){
        $("#mainHeader").text("Analysis Result");
        $("#smallerHeader").text("Showing dataset: "+ setName);
        $("#interfaceWorkflow").hide();
        $("#interfaceExecute, #interfaceReset").fadeIn();
        $("#finalResult").show();
        getDataParams();
    });
    function getRenameInput(){
        var renameInput = $("<input id='renameInput'>").val(setName);
        var saveBtn = $("<button id='setNameSave' class='button'>Save</button>").click(saveSetName);
        $("#DatasetRename").append(renameInput);
        $("#DatasetRename").append(saveBtn);
    }
    function saveSetName(){
        setName = $("#renameInput").val();
        $("#DatasetRename").hide();
        $("#smallerHeader").text("Showing dataset: "+setName);
        UTIL.renameWorkingSet(UTIL.getCurrentWorkingSetID(), setName, false);
        $("#smallerHeader").hide().show();
        $("#DatasetRename").html("");
    }
    //Gets data before analysis/exploration
    function getDataParams(callback) {
        params = {
            "password": UI.getPassword(),
            "username": UI.getUsername(),
            "working_set_name": String(setName),
            "type": "collection",
            "return_all_data": false
        }
        if (media == "twitter") {
            params["function"] = "twitter_search";
            params["module"] = "twitter";
            params["input"] = {};
            params["input"]["count"] = count;
            params["input"]["lang"] = "en";
            params["input"]["latitude"] = "";
            params["input"]["longitude"] = "";
            params["input"]["query"] = query;
            params["input"]["radius"] = "";
        } else if (media == "youtube") {
            params["function"] = "search";
            params["module"] = "youtube";
            params["input"] = {};
            params["input"]["order"] = sorting;
            params["input"]["query"] = query;
        }
        else if (media == "ny_times") {
            params["function"] = "article_search";
            params["module"] = "nytimes";
            params["input"] = {};
            params["input"]["begin_date"] = "";
            params["input"]["end_date"] = "";
            params["input"]["query"] = query;
            params["input"]["sort"] = sorting;
         } else if (media == "facebook") {
            params["function"] = "facebook_search";
            params["module"] = "facebook";
            params["input"] = {};
            params["input"]["count"] = count;
            params["input"]["query"] = query;
            params["input"]["type"] = "page";
        } else if (media == "reddit"){
            params["function"] = "fetchPosts";
            params["module"] = "reddit";
            params["input"] = {};
            params["input"]["count"] = count;
            params["input"]["reddit_sorting"] = sorting;
            params["input"]["sub"] = String(subreddit);
        }
        //clear cache, since now working set is modified
        UTIL.clearWorkingSetCache();
        UI.toggleLoader(true);
        console.log(params);
        API.sendRequest({
            data: params,
            success: function (data) {
                if (params['return_all_data']) {
                    //then this can be put in cache
                    UTIL.setCurrentWorkingSet(data, true);
                } else {
                    UTIL.setCurrentWorkingSet(data, false);
                }
                myData = data;
                var myType = params["type"];
                $("#finalResult").empty();
                MainScreen.InterfaceShowResults(myData, myType, null);
                //if this was a collection type, show output meta and move onto analysis stage
                //if this was an analysis type, show output and additional analysis options
            },
            complete: function () {
                UI.toggleLoader(false);
                //interfaceShowAllData(myData.data, myData.meta, myData.analysis, "collection", 0);
                isDataGotten = true;
                var ws = UTIL.getWorkingSet(UTIL.getCurrentWorkingSetID(), false);
                //setName = ws["working_set_name"];
                if (callback) {
                    callback.call();
                }
            }
        })
    }
    $("#getAnalysisBtn").click(function() {
        if (isDataGotten) {
            params = {};
            params = {
                "password": UI.getPassword(),
                "return_all_data": false,
                "type": "analysis",
                "username": UI.getUsername(),
                "working_set_id": UTIL.getCurrentWorkingSetID()
            };

            params["function"] = String(analysis);
            if (isTextAnalysis(analysis)) {
                params["module"] = "text";
            } else {
                params["module"] = "stats";
            }
            if (hasTwoFields) {
                params["input"] = {
                    "field_1": String(analysisParam[0]),
                    "field_2": String(analysisParam[1])
                }
            } else {
                if (analysis == "word_count") {
                    params["input"] = {
                        "field": String(analysisParam[0]),
                        "ignore_stopwords": "true"};
                } else {
                    params["input"] = {"field": String(analysisParam[0])};
                }
            }
            //myData = null;
            UI.toggleLoader(true);
            //clear cache, since now working set is modified
            UTIL.clearWorkingSetCache();
            console.log(params);
            API.sendRequest({
                data: params,
                success: function (data) {
                    console.log("Operator output:");
                    console.log(data);
                    if (params['return_all_data']) {
                        //then this can be put in cache
                        UTIL.setCurrentWorkingSet(data, true);
                    } else {
                        UTIL.setCurrentWorkingSet(data, false);
                    }
                    myData = data;
                    var myType = params["type"];
                    MainScreen.InterfaceShowResults(myData, myType, 0);
                    $("#finalResult").fadeIn();
                    //if this was a collection type, show output meta and move onto analysis stage
                    //if this was an analysis type, show output and additional analysis options
                },
                complete: function () {
                    console.log(UTIL.CFG.api_endpoint);
                    UI.toggleLoader(false);
                    //MainScreen.interfaceShowAllData(myData["data"], myData["meta"], myData["analysis"], "analysis", 0);
                }
            });
        }
    });
    function getVisualization(){
        if (isDataGotten) {
            var VISparams = {
                "function": exploration,
                "module": "graph",
                "password": UI.getPassword(),
                "return_all_data": false,
                "type": "visualization",
                "username": UI.getUsername(),
                "working_set_id": UTIL.getCurrentWorkingSetID()
            };
            if (exploration == "regression" || exploration == "scatterplot") {
                VISparams["input"] = {
                    "x-field": expParam[0],
                    "y-field": expParam[1]
                };
            } else if (exploration == "histogram") {
                VISparams["input"] = {
                    "field": expParam[0],
                    "num_splits": 10
                };
            } else {
                VISparams["input"] = {"field": expParam[0]};
            }
            var b = createBox('visualization');
            b.find("h2").html("Exploration Results");
            b.find("h2").parent().append(closeBoxButton());
            var mod = "graph";
            var fn = exploration;
            VIS.callFunction(b[0], mod, fn, VISparams,
                function () {
                    $("#finalResult").append(b);
                    b.hide().fadeIn();
                    $("#finalResult").show();
                    //Code "borrowed" from http://stackoverflow.com/questions/8973711/export-an-svg-from-dom-to-file
                    // Add some critical information
                    var svg = b.find("svg");
                    svg.attr({ version: '1.1', xmlns: "http://www.w3.org/2000/svg"});
                    var svg = '<svg>' + svg.html() + '</svg>';
                    var b64 = btoa(svg); // or use btoa if supported
                    // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
                    b.append($("<a target='_blank' href-lang='image/svg+xml' class='button' href='data:image/svg+xml;base64,\n" + b64 + "' title='file.svg'>Download</a>"));
                });
            function createBox(type, index) {
                //create a new empty box
                return $("<div class='results " + type + "'><div class='bar group'><h2></h2></div></div>");
            }

            function closeBoxButton() {
                return $("<a class='button close'>X</a>").click(closeBox);
            }

            function closeBox() {
                $(this).parent().parent().detach();
            }
        }
    }
});