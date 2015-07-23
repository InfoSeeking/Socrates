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

    //add Flickr and Reddit when ready
    myMedia[0] = {0: "Twitter", 1: "Youtube", 2: "NY Times", 3: "Facebook"};

    twitter["analysis"] = {0: "sentiment", 1: "word_count", 2: "correlation", 3: "regression", 4: "basic"};
    twitter["analysisText"] = {0: "content"};
    twitter["analysisStat"] = {0: "friends", 1: "followers", 2: "retwc"};

    youtube["analysis"] = {0: "correlation", 1: "regression", 2: "basic"};
    youtube["analysisStat"] = {0: "dislikeCount", 1: "likeCount", 2: "commentCount", 3: "viewCount", 4: "duration(sec)", 5: "favoriteCount"};

    nyt["analysis"] = {0: "sentiment", 1: "word_count", 2: "basic"};
    nyt["analysisText"] = {0: "lead_paragraph", 1: "abstract"};
    nyt["analysisStat"] = {0: "word_count"};

    fb["analysis"] = {0: "sentiment", 1: "word_count"};
    fb["analysisText"] = {0: "category", 1: "name"};

    var count = 25;
    var query= "";
    var media = "";
    var analysis = "";
    var mediaArr = new Array();
    var analysisArr = new Array();

    var analysisParam = new Array();
    var hasTwoFields = false;
    var myData;
    var params;
    var browser;
    var header1 = "1. What topic you are interested in?";
    var header2 = "2. Where would you like to get the data from?";
    var header3 = "3. What would you like to do with the data you collect about these topics?";
    var header4 = "4. Pick parameters for analysis";
    var smHeader1 = "Please type one or more words:";
    var smHeader2 = "The social media sources available to you are (choose one):";
    var smHeader3 = "The analysis modules available to you are:";
    $("#social, #interfaceAnalysis, #interfaceWorkflow, #interfaceNext1, #interfaceNext2, #interfaceBack, #interfaceInput, #interfaceDone, #interfaceExecute, #count").hide();
    document.getElementById("interfaceReset").addEventListener("click", reset, true);
    document.getElementById("resetBtn").addEventListener("click", reset, true);
    document.getElementById("getSuggestions").addEventListener("click", q1, true);
    document.getElementById("interfaceNext1").addEventListener("click", q2, true);

    //Question 1: asks about query
    function q1(){
        if (UI.isLoggedIn()) {
            $("#interfaceInfo,#interfaceWorkflow").hide();
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
            getSocial();
            $("#interfaceNext2, #interfaceBack, #social, #count").fadeIn();
            $("#interfaceInput, #interfaceNext1,#interfaceWorkflow").hide();
            gettingStarted.innerHTML = header2;
            smallerText.innerHTML = smHeader2;
        }
    }
    //Questions 3: asks about analysis, dependant on social media chosen
    function q3(){
        count = document.getElementById("countInput").value;
        console.log(count);
        if(mediaArr.length !== 1) {
            alert("Please select one social media");
        }else {
            media = mediaArr[0];
            interfaceNext2.innerHTML = "Next";
            $("#interfaceAnalysis, #interfaceNext2").fadeIn();
            gettingStarted.innerHTML = header3;
            smallerText.innerHTML = smHeader3;
            $("#social,#interfaceWorkflow, #count").hide();
            getAnalysisBtns(media);
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
            if (isTextAnalysis(analysis) || analysis == "basic") {
                hasTwoFields = false;
                smallerText.innerHTML = "Please select a parameter for this field:";
                $("#interfaceAnalysisOptions").append($("<h4>Field:</h4>"));
                getAnalysisParams();
            } else {
                hasTwoFields = true;
                smallerText.innerHTML = "Please select a parameter for field1 and field2:";
                $("#interfaceAnalysisOptions").append($("<h4>Field1:</h4>"));
                getAnalysisParams();
                $("#interfaceAnalysisOptions").append($("<h4>Field2:</h4>"));
                getAnalysisParams();
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
        var text;
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
        }
        if ($("#interfaceAnalysis").is(":visible") && isOrange){
            analysisArr.push(text);
        }else if ($("#interfaceAnalysis").is(":visible") && !isOrange) {
            index = analysisArr.indexOf(text);
            if (index !== -1) {
                analysisArr.splice(index,1);
            }
        }
    }
    //Set up social media buttons
    function getSocial(){
        if (document.getElementById("social").innerHTML == "") {
            var arr = myMedia;
            var count = 0;
            var temp;
            while (true) {
                temp = arr[0][count];
                if (temp != null) {
                    var btn = $("<div class='circle-btn'>" + temp + "</div>").click(circleBtns);
                    $("#social").append(btn);
                    count++;
                } else {
                    break;
                }
            }
        }
    }
    //Set up analysis buttons
    function getAnalysisBtns(myMedia) {
        if (document.getElementById("interfaceAnalysis").innerHTML == "") {
            var arr = getMedia(myMedia);
            currentMedia = arr;
            var count = 0;
            var temp;
            while (true) {
                temp = arr["analysis"][count];
                if (temp != null) {
                    var btn = $("<div class='circle-btn'>" + temp + "</div>").click(circleBtns);
                    $("#interfaceAnalysis").append(btn);
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
    $("#interfaceNext2").click(function() {
        var text = gettingStarted.innerHTML;
        if(text == header2){
            q3();
        }else if (text == header3) {
            q4();
        }else{
            showWorkflow();
        }
    });
    function showWorkflow() {
        if((hasTwoFields && analysisParam.length != 2) || (!hasTwoFields && analysisParam.length != 1)) {
            if(hasTwoFields){
                alert("Please select two parameter.");
            }else {
                alert("Please select one parameter.");
            }
        }else {
            $("#interfaceAnalysis, #interfaceNext2, #interfaceBack,#interfaceAnalysisOptions").hide();
            smallerText.innerHTML = "";
            gettingStarted.innerHTML = "Research Statement";
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
           q2();
           $("#interfaceAnalysis, #interfaceInput").hide();

       }else if(text.indexOf("2") != -1){
           $("#social, #interfaceNext2, #interfaceBack").hide();
           q1();
       } else if (text.indexOf("4") != -1){
           $("#interfaceAnalysisOptions").hide();
           q3();
       }
    });
    $("#interfaceDone").click(function() {
        $("#social, #interfaceDone, #interfaceNext2").hide();
        showWorkflow();
    });

    function reset(){
        query= "";
        media = "";
        analysis = "";
        mediaArr = new Array();
        analysisArr = new Array();
        document.getElementById("interfaceInput").value = "";
        $("#interfaceWorkflow, #interfaceExecute").hide();
        $("#getSuggestions").fadeIn();
        gettingStarted.innerHTML = "Getting Started";
        interfaceNext2.innerHTML = "Next";
        document.getElementById("smallerText").innerHTML = "Welcome to SOCRATES 2.0"+ "<br>"+
        "We are now introducing a new interface which will collect and analyse data through a series of questions." +"<br>"+
        "If you would like to use this new feature click"+"<b>"+" Get Suggestions"+"</b>, <br>"+
            "otherwise, proceed as usual in the left side bar.";
        document.getElementById("social").innerHTML = "";
        document.getElementById("interfaceAnalysis").innerHTML = "";
        document.getElementById("interfaceAnalysisOptions").innerHTML = "";
        document.getElementById("finalResult").innerHTML = "";
        document.getElementById("countInput").value = 25;
        analysisParam = null;
        analysisParam = new Array();
    }
    $("#interfaceExecuteBtn").click(function(){
        gettingStarted.innerHTML = "Result";
        $("#interfaceWorkflow").hide();
        $("#interfaceExecute, #interfaceReset").fadeIn();
        //count = prompt("Please enter number of items:");
        getDataParams();
        //getAparams();
    });

    function getDataParams() {
        var params = {
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
                MainScreen.InterfaceShowResults(myData, myType, null);

                //if this was a collection type, show output meta and move onto analysis stage
                //if this was an analysis type, show output and additional analysis options
            },
            complete: function (jqXHR, stat) {
                console.log(UTIL.CFG.api_endpoint);
                console.log("Complete: " + stat);
                UI.toggleLoader(false);
                //interfaceShowAllData(myData.data, myData.meta, myData.analysis, "collection", 0);
            }
        });
    }
    $("#getAnalysisBtn").click(function() {
        params = {};
        params = {
            "password": UI.getPassword(),
            "return_all_data": false,
            "type": "analysis",
            "username": UI.getUsername(),
            "working_set_id" : UTIL.getCurrentWorkingSetID()
        };

        params["function"] = String(analysis);
        if (isTextAnalysis(analysis)) {
            params["module"] = "text";
        } else {
            params["module"] = "stats";
        }
        if (hasTwoFields) {
            params["input"]["field_1"] = String(analysisParam[0]);
            params["input"]["field_2"] = String(analysisParam[1]);
        } else {
            params["input"] = {"field": String(analysisParam[0])};
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
    });

});