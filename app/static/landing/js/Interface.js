/**
 * Created by Anastasia Ryssiouk on 6/29/15.
 */
$(document).ready(function() {
    var currentMedia = new Array();
    var twitter = new Array();
    var youtube = new Array();
    var reddit = new Array();
    var nyt = new Array();
    var flickr = new Array();
    var fb = new Array();
    var myMedia = new Array();
    var myGraphs = new Array();

    //add Flickr and Reddit when ready
    myMedia[0] = {0: "Twitter", 1: "Youtube", 2: "NY Times", 3: "Facebook"};
    myGraphs[0] = {0: "histogram", 1: "scatterplot", 2: "piechart", 3: "regression"};

    twitter["analysis"] = {0: "sentiment", 1: "word_count", 2: "correlation", 3: "regression", 4: "basic"};
    twitter["analysisText"] = {0: "username", 1: "tweet_id",2: "created", 3: "authorloc", 4: "content", 5: "source", 6: "authorid"};
    twitter["analysisStat"] = {0: "friends", 1: "followers", 2: "retwc"};
    twitter["textPic"] = "img/twitter_text.png";
    twitter["statPic"] = "img/twitter_stat.png";

    youtube["analysis"] = {0: "sentiment", 1: "word_count", 2: "correlation", 3: "regression", 4: "basic"};
    youtube["analysisStat"] = {0: "dislikeCount", 1: "likeCount", 2: "commentCount", 3: "viewCount", 4: "duration(sec)", 5: "favoriteCount"};
    youtube["analysisText"] = {0: "publishedAt", 1: "id", 2: "category", 3: "title", 4: "channelTitle"};
    youtube["textPic"] = "img/youtube_text.png";
    youtube["statPic"] = "img/youtube_stat.png";

    nyt["analysis"] = {0: "sentiment", 1: "word_count", 2: "basic"};
    nyt["analysisText"] = {0: "lead_paragraph", 1: "headline", 2: "abstract", 3: "snippet", 4: "web_url"};
    nyt["analysisStat"] = {0: "word_count"};
    nyt["exploration"] = {};
    nyt["textPic"] = "img/nyt_text.png";
    nyt["statPic"] = "img/nyt_stat.png";

    fb["analysis"] = {0: "sentiment", 1: "word_count"};
    fb["analysisText"] = {0: "category", 1: "name"};
    fb["textPic"] = "img/fb_text";

    //FINISH FILLING IN FLICKR AND REDDIT DATA******
    flickr["analysis"] = {0: "sentiment", 1: "word_count", 2: "correlation", 3: "regression", 4: "basic"};

    reddit["analysis"] = {0: "correlation", 1: "regression", 2: "basic"};
    reddit["commentAnalysis"] = {0: "sentiment", 1: "word_count"};
    //FILL THIS IN*****
    reddit["analysisText"] = {0: "", 1: ""};
    reddit["analysisStat"] = {0: "", 1: ""};

    var count = "25";
    var query = "";
    var media = "";
    var analysis = "";
    var exploration = "";
    var numsplits = 10;
    var mediaArr = new Array();
    var analysisArr = new Array();
    var expArr = new Array();
    var analysisParam = new Array();
    var expParam = new Array();
    var hasTwoFields = false;
    var myData;
    var isDataGotten = false;
    var params;
    var browser;
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
        "#interfaceBack, #interfaceInput, #interfaceDone, #interfaceExecute, #count, #social, #interfaceExp, " +
        "#numSplits, #interfaceExpResults").hide();
    $("#interfaceReset").click(reset);
    $("#resetBtn").click(reset);
    $("#expResetBtn").click(reset);
    $("#getSuggestions").click(q1);
    $("#interfaceNext1").click(q2);
    $("#explorationBtn").click(q5);

    //Question 1: asks about query
    function q1(){
        if (UI.isLoggedIn()) {
            $("#interfaceInfo,#interfaceWorkflow, #count").hide();
            $(this).hide();
            $("#interfaceNext1").fadeIn();
            gettingStarted.innerHTML = header1;
            smallerText.innerHTML = smHeader1;
            $("#interfaceInput").fadeIn();
        }else{
            alert("Please log in");
        }
    }
    //Questions 2: asks about social media
    function q2(){
        interfaceNext2.innerHTML = "Next";
        query = document.getElementById("interfaceInput").value;
        if (query == "") {
            alert("Please enter keyword(s)");
        }else {
            $(this).hide();
            getCircleBtns("social", myMedia[0]);
            $("#interfaceNext2, #interfaceBack, #social, #count").fadeIn();
            $("#interfaceInput, #interfaceNext1,#interfaceWorkflow").hide();
            gettingStarted.innerHTML = header2;
            smallerText.innerHTML = smHeader2;
        }
    }
    //Questions 3: asks about analysis, dependant on social media chosen
    function q3(){
        count = document.getElementById("countInput").value;
        if(mediaArr.length !== 1) {
            alert("Please select one social media");
        }else {
            media = mediaArr[0];
            interfaceNext2.innerHTML = "Next";
            $("#interfaceAnalysis, #interfaceNext2").fadeIn();
            gettingStarted.innerHTML = header3;
            smallerText.innerHTML = smHeader3;
            $("#social,#interfaceWorkflow, #count").hide();
            currentMedia = getMedia(media);
            getCircleBtns("interfaceAnalysis", currentMedia["analysis"]);
        }
    }
    //Question 4: asks about analysis parameters specific to social media and analysis
    function q4(){
        if (analysisArr.length !== 1) {
            alert("Please select one analysis");
        }else {
            analysis = analysisArr[0];
            gettingStarted.innerHTML = header4;
            $("#interfaceAnalysis,#interfaceWorkflow").hide();
            $("#interfaceAnalysisOptions, #interfaceNext2").fadeIn();
            $("#interfaceAnalysisOptions").empty();
            interfaceNext2.innerHTML = "Finish";
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
                smallerText.innerHTML = "Please select a parameter for this field:";
                $("#interfaceAnalysisOptions").append($("<h4>Field:</h4>"));
                getAnalysisParams();
                $("#interfaceAnalysisOptions").append(image);
            } else {
                hasTwoFields = true;
                smallerText.innerHTML = "Please select a parameter for field_1 and field_2:";
                $("#interfaceAnalysisOptions").append($("<h4>field_1:</h4>"));
                getAnalysisParams();
                $("#interfaceAnalysisOptions").append($("<h4>field_2:</h4>"));
                getAnalysisParams();
                $("#interfaceAnalysisOptions").append(image);
            }
        }
    }
    //Question 5: which exploration
    function q5(){
        $("#BeatsResults, #interfaceWorkflow, #interfaceExpOptions, #numSplits").hide();
        interfaceNext2.innerHTML = "Next";
        smallerText.innerHTML = "";
        getCircleBtns("interfaceExp", myGraphs[0]);
        $("#interfaceNext2, #interfaceBack, #interfaceExp").fadeIn();
        gettingStarted.innerHTML = header6;
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
            interfaceNext2.innerHTML = "Finish";
            gettingStarted.innerHTML = header7;
            smallerText.innerHTML = "";
            if (exploration == "piechart") {
                hasTwoFields = false;
                smallerText.innerHTML = "Please select a parameter for this field:";
                $("#interfaceExpOptions").append($("<h4>field:</h4>"));
                getExpParams(exploration);
            } else if (exploration == "histogram"){
                hasTwoFields = false;
                smallerText.innerHTML = "Please select a parameter for this field:";
                $("#interfaceExpOptions").append($("<h4>field:</h4>"));
                getExpParams(exploration);
                $("#numSplits").fadeIn();
            } else {
                hasTwoFields = true;
                smallerText.innerHTML = "Please select a parameter for x_field and y_field:";
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
        /* navigator.sayswho found on stackoverflow
         http://stackoverflow.com/questions/10505966/determine-what-browser-being-used-using-javascript
        */
        navigator.sayswho= (function(){
            var N= navigator.appName, ua= navigator.userAgent, tem,
                M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i);
            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
            M= M? [M[1], M[2]]:[N, navigator.appVersion, '-?'];
            return M.join(' ');
        })();
        browser = navigator.sayswho;
        var blue;
        var orange;
        //Opera fits under Chrome
        if (browser.indexOf("Chrome") !== -1|| browser.indexOf("Safari") !== -1) {
            blue = "-webkit-linear-gradient(top, #00BAFF, #112D38)";
            orange = "-webkit-linear-gradient(top, #FF8400, #944D00)";
        } else if (browser.indexOf("Firefox") !== -1) {
            blue = "-moz-linear-gradient(top, #00BAFF, #112D38)";
            orange = "-moz-linear-gradient(top, #FF8400, #944D00)";
        //IE, not tested
        } else if (browser.indexOf("Explorer") !== -1) {
            blue = "-ms-linear-gradient(top, #00BAFF, #112D38)";
            orange = "-ms-linear-gradient(top, #FF8400, #944D00)";
        } else {
            blue = "linear-gradient(top, #00BAFF, #112D38)";
            orange = "linear-gradient(top, #FF8400, #944D00)";
        }

        if (this.getAttribute("background") == orange) {
            $(this).css("background", blue);
            this.setAttribute("background", blue);
        } else {
            isOrange = true;
            $(this).css("background", orange);
            this.setAttribute("background", orange);
        }
        var text = "";
        if (browser.indexOf("Firefox") != -1) {
            text = this.textContent;
        }else {
            text = this.innerText;
        }

        var index;
        if($("#social").is(":visible") && isOrange){
            mediaArr.push(text);
        }else if ($("#social").is(":visible") && !isOrange) {
            index = mediaArr.indexOf(text);
            if (index !== -1) {
                mediaArr.splice(index,1);
            }
        }else if ($("#interfaceAnalysis").is(":visible") && isOrange){
            analysisArr.push(text);
        }else if ($("#interfaceAnalysis").is(":visible") && !isOrange) {
            index = analysisArr.indexOf(text);
            if (index !== -1) {
                analysisArr.splice(index,1);
            }
        }else if ($("#interfaceExp").is(":visible") && isOrange){
            expArr.push(text);
        }else if ($("#interfaceExp").is(":visible") && !isOrange) {
            index = expArr.indexOf(text);
            if (index !== -1) {
                expArr.splice(index,1);
            }
        }
    }
    function getCircleBtns(id, arr){
        if (document.getElementById(id).innerHTML == "") {
            var ID = "#"+id;
            var count = 0;
            var temp;
            while (true) {
                temp = arr[count];
                if (temp != null) {
                    var btn = $("<div class='circle-btn'>" + temp + "</div>").click(circleBtns);
                    $(ID).append(btn);
                    count++;
                } else {
                    break;
                }
            }
        }
    }
    function getMedia(myMedia){
        var arr = new Array();
        switch (myMedia) {
            case "Twitter":
                arr = twitter;
                break;
            case "Youtube":
                arr = youtube;
                break;
            case "Reddit":
                arr = reddit;
                break;
            case "NY Times":
                arr = nyt;
                break;
            case "Flickr":
                arr = flickr;
                break;
            case "Facebook":
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
        while(true) {
            temp = arr[count];
            var btn;
            if (temp != null) {
                btn = $("<button class='button'>"+temp+"</button>").click(analysisParamBtn);
                $("#interfaceAnalysisOptions").append(btn);
                count++;
            } else {
                break;
            }
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
        var text;
        if (browser.indexOf("Firefox") != -1) {
            text = this.textContent;
        }else {
            text = this.innerText;
        }
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
                btn = $("<button class='button'>"+temp+"</button>").click(expParamBtn);
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
        var text;
        if (browser.indexOf("Firefox") != -1) {
            text = this.textContent;
        }else {
            text = this.innerText;
        }
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
    $("#interfaceNext2").click(function() {
        var text = gettingStarted.innerHTML;
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
                if(((hasTwoFields && expParam.length != 2) || (!hasTwoFields && expParam.length != 1))) {
                    if(hasTwoFields){
                        alert("Please select two parameters.");
                    }else {
                        alert("Please select one parameter.");
                    }
                }else {
                    $("#interfaceExpOptions, #interfaceBack, #interfaceNext2, #numSplits").hide();
                    gettingStarted.innerHTML = "Exploration Results";
                    //ADD DATASETNAME!!!!!****
                    smallerText.innerHTML = "Dataset: ";
                    $("#interfaceExpResults").fadeIn();
                    getDataParams();
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
            smallerText.innerHTML = "";
            gettingStarted.innerHTML = header5;
            BeatsResults.innerHTML = "I'm interested in <b>" + query + "</b> <button class='interfaceEdit' id='edit1'>edit</button><br>" +
                "I want to use <b>" + media + "</b> (count "+count+"), <button class='interfaceEdit' id='edit2'>edit</button><br>" +
                "My method is <b>" + analysis + "</b>, <button class='interfaceEdit' id='edit3'>edit</button><br> " +
                "With parameter(s) <b>" + analysisParam.toString() + ". <button class='interfaceEdit' id='edit4'>edit</button>";
            $("#interfaceWorkflow").fadeIn();
            document.getElementById("edit1").addEventListener("click", q1, true);
            document.getElementById("edit2").addEventListener("click", q2, true);
            document.getElementById("edit3").addEventListener("click", q3, true);
            document.getElementById("edit4").addEventListener("click", q4, true);
        }
    };

    $("#interfaceBack").click(function() {
       text = gettingStarted.innerHTML
       if(text.indexOf("3") != -1) {
           $("#interfaceAnalysis, #interfaceInput").hide();
           mediaArr = new Array();
           document.getElementById("social").innerHTML = "";
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
        query= "";
        media = "";
        analysis = "";
        exploration = "";
        mediaArr = new Array();
        analysisArr = new Array();
        expArr = new Array();
        analysisParam = new Array();
        expParam = new Array();
        isDataGotten = false;
        hasTwoFields = false;
        params = {};
        myData = null;
        document.getElementById("interfaceInput").value = "";
        $("#interfaceWorkflow, #interfaceExecute, #interfaceExpResults").hide();
        $("#getSuggestions").fadeIn();
        gettingStarted.innerHTML = "Getting Started";
        interfaceNext2.innerHTML = "Next";
        BeatsResults.innerHTML = "";
        smallerText.innerHTML = "Welcome to SOCRATES 2.0"+ "<br>"+
        "We are now introducing a new interface which will collect and analyse data through a series of questions." +"<br>"+
        "If you would like to use this new feature click"+"<b>"+" Get Suggestions"+"</b>, <br>"+
            "otherwise, proceed as usual in the left side bar.";
        document.getElementById("social").innerHTML = "";
        document.getElementById("interfaceAnalysis").innerHTML = "";
        document.getElementById("interfaceAnalysisOptions").innerHTML = "";
        document.getElementById("finalResult").innerHTML = "";
        document.getElementById("countInput").value = 25;

    }
    function expReset(){
        showWorkflow(true);
        $("#interfaceExpResults").hide();
        $("#finalResult").empty();
    }
    $("#interfaceExecuteBtn").click(function(){
        gettingStarted.innerHTML = "Analysis Result";
        //ADD DATASETNAME!!!!!****
        smallerText.innerHTML = "Dataset: ";
        $("#interfaceWorkflow").hide();
        $("#interfaceExecute, #interfaceReset").fadeIn();
        getDataParams();
    });
    function getDataParams() {
        params = {
            "password": UI.getPassword(),
            "username": UI.getUsername(),
            "working_set_name": "Untitled",
            "type": "collection",
            "return_all_data": false
        }
        if (media == "Twitter") {
            params["function"] = "twitter_search";
            params["module"] = "twitter";
            params["input"] = {};
            params["input"]["count"] = count;
            params["input"]["lang"] = "en";
            params["input"]["latitude"] = "";
            params["input"]["longitude"] = "";
            params["input"]["query"] = query;
            params["input"]["radius"] = "";
        } else if (media == "Youtube") {
            params["function"] = "search";
            params["module"] = "youtube";
            params["input"] = {};
            params["input"]["order"] = "relevance";
            params["input"]["query"] = query;
        }
        else if (media == "NY Times") {
            params["function"] = "article_search";
            params["module"] = "nytimes";
            params["input"] = {};
            params["input"]["begin_date"] = "";
            params["input"]["end_date"] = "";
            params["input"]["query"] = query;
            params["input"]["sort"] = "newest";
         } else if (media == "Facebook") {
            params["function"] = "facebook_search";
            params["module"] = "facebook";
            params["input"] = {};
            params["input"]["count"] = count;
            params["input"]["query"] = query;
            params["input"]["type"] = "page";
        }
        //clear cache, since now working set is modified
        UTIL.clearWorkingSetCache();
        UI.toggleLoader(true);
        $.ajax({
            url: UTIL.CFG.api_endpoint,
            dataType: "json",
            type: "POST",
            data: params,
            success: function (data, stat, jqXHR) {
                console.log("Operator output:");
                console.log(data);
                if (data.hasOwnProperty("error")) {
                    UI.feedback(data.message, true);
                    return;
                }
                if (params['return_all_data']) {
                    //then this can be put in cache
                    UTIL.setCurrentWorkingSet(data, true);
                } else {
                    UTIL.setCurrentWorkingSet(data, false);
                }
                myData = data;
                var myType = params["type"];
                MainScreen.InterfaceShowResults(myData, myType, null);
                //if this was a collection type, show output meta and move onto analysis stage
                //if this was an analysis type, show output and additional analysis options
            },
            complete: function (jqXHR, stat) {
                console.log("Complete: " + stat);
                UI.toggleLoader(false);
                //interfaceShowAllData(myData.data, myData.meta, myData.analysis, "collection", 0);
                isDataGotten = true;
            }
        });
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
            $.ajax({
                url: UTIL.CFG.api_endpoint,
                dataType: "json",
                type: "POST",
                data: params,
                success: function (data, stat, jqXHR) {
                    console.log("Operator output:");
                    console.log(data);
                    if (data.hasOwnProperty("error")) {
                        UI.feedback(data.message, true);
                        return;
                    }

                    if (params['return_all_data']) {
                        //then this can be put in cache
                        UTIL.setCurrentWorkingSet(data, true);
                    } else {
                        UTIL.setCurrentWorkingSet(data, false);
                    }
                    myData = data;
                    var myType = params["type"];
                    MainScreen.InterfaceShowResults(myData, myType, 0);
                    //if this was a collection type, show output meta and move onto analysis stage
                    //if this was an analysis type, show output and additional analysis options
                },
                complete: function (jqXHR, stat) {
                    console.log(UTIL.CFG.api_endpoint);
                    console.log("Complete: " + stat);
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
