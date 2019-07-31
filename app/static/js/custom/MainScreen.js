var MainScreen = (function(){
    var curChooser = null;//current field chooser
    var that = {};
    var working_set_cache = null,
    working_set_id = null;
    that.show = function(){
        $(".screen.main").show();
    };
    that.hide = function(){
        $(".screen.main").hide();
    };

    function passCollectionPhase(){
        $(".type-instructions").hide();
        $("#topbar .item").removeClass("active");
        //show analysis and visualization page
        showType("analysis");
        showType("visualization");
        //$(".more").fadeIn()
    }

    /*
    BEGIN FUNCTIONS FOR WORKING SETS
    */
    that.setCurrentWorkingSet = function(ws, cache){
        working_set_id = ws["working_set_id"];
        if(cache){
            working_set_cache = ws;
        }
    }

    that.getCurrentWorkingSetID = function(){
        return working_set_id;
    }

    that.clearWorkingSetCache = function(){
        working_set_cache = null;
    }

    that.getWorkingSet = function(refID, callback){
        //check if cached
        if(working_set_cache != null && working_set_id == refID){
            callback.call(window, working_set_cache);
        }
        else{
            //download fresh data
            $.ajax({
                url: UTIL.CFG.api_endpoint,
                dataType: "json",
                type: "POST",
                data: JSON.stringify({
                    'fetch' : true,
                    'returnAllData': true,
                    'working_set_id': refID,
                    'format':'json'
                }),
                contentType:"application/json",
                success : function(data, stat, jqXHR){
                    working_set_cache = data;
                    if(callback){
                      callback.call(window, data);
                    }
                },
                error: function(){
                    UI.feedback("Error fetching dataset", true);
                }
            });
        }
    };

    that.showSavedDataset = function(working_set) {
        //console.log("Showing data for " + typ + "," + index);
        that.setCurrentWorkingSet(working_set);
        clear();
        var ws = working_set;//easier
        console.log(ws);
        var table = $("<table class='table'></table>");
        var thead = $("<thead></thead>");
        var tbody = $("<tbody></tbody>");

        var cData = ws["data"];
        //build the top row
        var headRow = $("<tr></tr>")
        headRow.append("<th>Index</th>");
        for(var f in ws["meta"]){
            if(ws["meta"].hasOwnProperty(f)){
                headRow.append("<th class='field' data-type='collection' data-fieldtype='" + ws["meta"][f] + "'>" + f + "</th>");
            }
        }
        tbody.append(thead.append(headRow));
        for(var i = 0; i < cData.length; i++){
            var row = $("<tr><td>" + i + "</td></tr>");
            for(var f in ws["meta"]){
                if(ws["meta"].hasOwnProperty(f)){
                    row.append("<td>" + cData[i][f] + "</td>");
                }
            }

            tbody.append(row);
        }

        //now add rows
        var html = $("<table class='table table-hover table-responsive'></table>").empty().append(thead).append(tbody);
        UI.overlay(html, "data", "Your Data");
        $(".type-instructions.analysis, .type-instructions.visualization").show();
    };

    that.removeWorkingSet = function(working_set_id, callback){
        UI.toggleLoader(true);
        $.ajax({
        url: UTIL.CFG.api_endpoint,
            dataType: "json",
            type: "POST",
            data: JSON.stringify({
                'remove' : true,
                'working_set_id': working_set_id
            }),
            contentType:"application/json",
            success : function(data, stat, jqXHR){
                working_set_cache = data;
                if(callback){
                    callback.call(window, data);
                }
                UI.toggleLoader(false);
            },
            error: function(){
                UI.feedback("Error removing dataset", true);
                    UI.toggleLoader(false);
            }
        });
    };

    that.renameWorkingSet = function(working_set_id, new_name, callback){
        UI.toggleLoader(true);
        $.ajax({
            url: UTIL.CFG.api_endpoint,
            dataType: "json",
            type: "POST",
            data: JSON.stringify({
                'rename' : true,
                'new_name' : new_name,
                'working_set_id': working_set_id
            }),
            contentType:"application/json",
            success : function(data, stat, jqXHR){
                if(callback){
                    callback.call(window);
                }
                UI.toggleLoader(false);
            },
            error: function(){
                UI.feedback("Error renaming dataset", true);
                UI.toggleLoader(false);
            }
        });
    };

    //downloads just dataset as CSV
    that.downloadDatasetCSV = function(working_set_id){
        that.getWorkingSet(working_set_id, function(working_set){
            var json = JSON.stringify(working_set);
        });
        var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=true&format=csv&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id;
        $.ajax({
            url: url,
            dataType: "text",
            type: "GET",
            contentType:"application/json",
            success : function(data, stat, jqXHR){
              download(data, "dataset.csv", "text/plain");
            },
            error: function(){
                UI.feedback("Error in downloadDatasetCSV", true);
                UI.toggleLoader(false);
            }
        });
        //var win = window.open();
    }

    //downloads just dataset as JSON
    that.downloadDatasetJSON = function(working_set_id){
        that.getWorkingSet(working_set_id, function(working_set){
            var json = JSON.stringify(working_set);
        });
        var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=true&format=json&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id
        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            contentType:"application/json",
            success : function(data, stat, jqXHR){
              download(JSON.stringify(data,undefined,2), "dataset.json", "text/plain");

            },
            error: function(){
                UI.feedback("Error in downloadDatasetJSON", true);
                UI.toggleLoader(false);
            }
        });
        //var win = window.open();
    }

    //downloads entire workflow as JSON
    that.downloadWorkingSet = function(working_set_id){
        that.getWorkingSet(working_set_id, function(working_set){
            var json = JSON.stringify(working_set);
            //var win = window.open("data:application/csv;charset=utf8," + encodeURIComponent(json), "_blank");
        });
        // download("hello world", "dlText.txt", "text/plain");
        var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=false&format=json&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id
        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            contentType:"application/json",
            success : function(data, stat, jqXHR){
              download(JSON.stringify(data,undefined,2), "workflow.json", "text/plain");

            },
            error: function(){
                UI.feedback("Error in downloadWorkingSet", true);
                UI.toggleLoader(false);
            }
        });
    }
    /*
    END FUCNTIONS FOR WORKING SETS
    */


    /*
    Get all specs, build forms, set up event listeners
    */
    that.init = function(){
        console.log("hello");
        //UI.toggleLoader(true);
        $.ajax({
            url: UTIL.CFG.api_endpoint,
            dataType: "json",
            data : JSON.stringify({
                "specs" : true
            }),
            contentType: "application/json",
            type: "POST",
            error: function(){
                UI.feedback("Cannot fetch specs", true);
                UI.toggleLoader(false);
            },
            success : function(data, stat, jqXHR){
                if(!UI.isLoggedIn()) {
                    console.log("Switching");
                    UI.switchScreen("login");
                }
                UI.toggleLoader(false);
                console.log(UTIL.CFG.api_endpoint);
                console.log("Data:");
                //console.log((data["analysis"]));
                //Add Visualization specs
                // data = VIS.specs;
                data.visualization = VIS.specs; //add the visualization stuff to data
                console.log(data);
                //generate all forms
                var types = ["analysis", "collection", "visualization"];
                for(var i = 0; i < types.length; i++){
                    var type = types[i];
                    console.log("TYPE");
                    console.log(type);

                    for(var mod in data[type]){
                        console.log("MOD");
                        console.log(mod);
                        if(!data[type].hasOwnProperty(mod)){
                            continue;
                        }
                        //make top level button for module
                        //$(".type-instructions." + type + " .modules").append("<button class='button' href='#' data-type='" + type + "' data-mod='" + mod + "'>" + mod + "</button>");

                        if(type == 'collection') { //if type = collection, create a dropdown menu instead of buttons
                            var mod_list= $("<li class='mod'><a class= 'options' href='#' data-type='" + type + "' data-mod='" + mod + "'>"+ mod +"</a></li>");
                            var icon = $("<i class='fab fa-" + mod + "'></i>");
                            if(mod == "nytimes") {
                                icon = $("<i class='fas fa-newspaper'></i>");
                            }
                            mod_list.find("a").prepend(icon);
                            $(".type-instructions." + type + " .modules").append(mod_list);
                        }
                        else { //add buttons to the workflow card
                            $(".type-instructions." + type + " .modules").append("<button class='options btn btn-primary' href='#' data-type='" + type + "' data-mod='" + mod + "'>" + mod + "</button>");
                        }


                        var fns = data[type][mod].functions;
                        for(var fn in fns){
                            if(!fns.hasOwnProperty(fn)){
                                continue;
                            }
                            //add name of function to card-title/modal-title
                            /* if (i==0) { //if analysis
                                  $("#fn-analysis").append("<h4 id='" + fn + "'>" + fn + "</h4");
                                  $("#fn-analysis").hide();
                              }
                              else if(i == 1) { //if collection -> add fn to modal title
                                  $("#fn-collection").append("<h4>" + fn + "</h4");
                              }
                              else { //if visualization -> add fn to card title
                                  $("#fn-visualization").append("<h4>" + fn + "</h4");
                              }*/
                            //hide all titles

                            var fn_name = fns[fn].name;
                            console.log(fn_name);
                            console.log(fn_name);
                            var dom_form = $("<div class='function' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'></div>");
                            //dom_form.append("<h4>" + fn + "</h4>");
                            //console.log(fn);
                            console.log("genForm:");
                            //console.log(genForm(fns[fn].param, type, fns[fn].param_order).html());
                            dom_form.append(genForm(fns[fn].param, type, fns[fn].param_order));
                            console.log("done");

                            if(i == 1) { //if type = collection, create buttons on the modal
                                $(".type-instructions." + type + " .functions").append("<button class='options btn btn-success' href='#' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "' name='" + fn_name + "'>" + fn_name + "</button>");
                                $("#forms-c").append(dom_form);
                            }
                            else { //add buttons on the workflow card
                                $(".type-instructions." + type + " .functions").append("<button class='options btn btn-success' href='#' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "' name='" + fn_name + "'>" + fn_name + "</button>");
                                if (i == 0) { //analysis
                                    $("#forms-a").append(dom_form);
                                } else { //visualization
                                    $("#forms-v").append(dom_form);
                                }
                            }
                            //make sub level button for function
                            //$(".type-instructions." + type + " .functions").append("<button class='button' href='#' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'>" + fn + "</button>")
                            //$("#forms").append(dom_form);
                        }
                    }
                }

                //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                // Add functions to download buttons
                $("#entireworkflow").click(onDownloadWorkflowButtonClicked);
                $("#datasetjson").click(onDownloadDatasetJSONButtonClicked);
                $("#datasetcsv").click(onDownloadDatasetCSVButtonClicked);

                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                //add listeners on submission
                //$(".function form").on("submit", function(e){
                $("#submit-c, #submit-a, #submit-v").on("click", function(e){
                    e.preventDefault();
                    $('#modal-collection').modal('hide');

                    //extract type, mod, and fn from the submit button
                    var div_form = $(this),
                        div_type= div_form.attr("submit-type"),
                        div_mod= div_form.attr("submit-mod"),
                        div_fn= div_form.attr("submit-fn"),
                        fn_name = div_form.attr("name");
                    var form = $("div").find(".function[data-type=" + div_type + "][data-fn=" + div_fn + "][data-mod=" + div_mod + "]");
                    console.log(fn_name);

                    //var form = $(#submit),
                    //var div = form.parent(),
                    var div = form,
                        inputs = form.find("input.toSend"),
                        selects = form.find("select.toSend"),
                        type = div.attr("data-type"),
                        mod = div.attr("data-mod"),
                        fn = div.attr("data-fn"),
                        setName = "Untitled",
                        params = {
                            "type": type,
                            "module" : mod,
                            "function" : fn
                        };
                    if (type == "collection"){
                        if (form.find("#setName").val()){
                            setName = form.find("#setName").val();
                            params["working_set_name"] = setName;
                        }
                        clear();
                    }
                    //$(this).parent().hide();
                    //passCollectionPhase();
                    //show analysis/visualization buttons
                    params["input"] = {};
                    //params['return_all_data'] = $("#allData").prop("checked") ? true : false;
                    params['return_all_data'] = true;

                    if((type == "analysis" || type == "visualization") && that.getCurrentWorkingSetID() != null){
                        //add current reference id
                        params["working_set_id"] = that.getCurrentWorkingSetID();
                    }
                    for(var i = 0; i < inputs.size(); i++){
                        var inp = $(inputs.get(i));
                        params["input"][inp.attr("name")] = inp.val();
                    }
                    for(var i = 0; i < selects.size(); i++){
                        var sel = $(selects.get(i));
                        params["input"][sel.attr("name")] = sel.val();
                    }

                    if(UI.isLoggedIn()){
                        params["username"] = UI.getUsername();
                        params["password"] = UI.getPassword();
                    }
                    //ajax call
                    /*if(type == "visualization"){
                        console.log(params);
                        console.log(params.input);
                        var b = createBox('visualization');
                        b.find("h2").html("Exploration Results");
                        b.find("h2").parent().append(closeBoxButton());
                        VIS.callFunction(b[0], mod, fn, params, function(){
                            /*$(".completed.visualization").append(b);
                            b.hide().fadeIn();
                            //Code "borrowed" from http://stackoverflow.com/questions/8973711/export-an-svg-from-dom-to-file
                            // Add some critical information
                            var svg = b.find("svg");
                            svg.attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});
                            var svg = '<svg>' + svg.html() + '</svg>';
                            var b64 = btoa(svg); // or use btoa if supported
                            // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
                            b.append($("<a target='_blank' href-lang='image/svg+xml' class='button' href='data:image/svg+xml;base64,\n"+b64+"' title='file.svg'>Download</a>"));
                        });
                        $(".type-instructions.visualization .card.working").hide();
                        $("#forms-v .function, #submit-v").hide();
                        $(".type-instructions." + type + " .functions .options").hide();
                    }*/

                    if(type == "visualization") {
                        that.clearWorkingSetCache();
                        console.log(params);
                        $.ajax({
                            url: UTIL.CFG.api_endpoint,
                            dataType: "json",
                            type: "POST",
                            data: JSON.stringify(params),
                            contentType: "application/json",
                            success: function (data) {
                                console.log(data);
                                showVisualization(data);
                                $(".type-instructions.visualization .card.working").hide();
                                $("#forms-v .function, #submit-v").hide();
                                $(".type-instructions." + type + " .functions .options").hide();
                                $(".type-instructions.visualization .results.visualization.card").fadeIn();

                            }
                        });
                    }

                    else{
                        //UI.toggleLoader(true);
                        //clear cache, since now working set is modified
                        that.clearWorkingSetCache();
                        console.log(params);
                        $.ajax({
                            url: UTIL.CFG.api_endpoint,
                            dataType: "json",
                            type: "POST",
                            data: JSON.stringify(params),
                            contentType: "application/json",
                            success : function(data, stat, jqXHR){
                                console.log("Operator output:");
                                console.log(data);
                                if(data.hasOwnProperty("error")){
                                    UI.feedback(data.message, true);
                                    return;
                                }
                                console.log(fn_name);
                                showDataset(data);

                                $("#workspace #intro").hide();
                                showDataset(data);

                                if(type == "analysis") {
                                    $(".type-instructions.analysis .card.working").hide();
                                    $("#forms-a .function, #submit-a").hide();
                                    showSummary(data);
                                }

                                /*else if (type == "collection") {
                                    $("#workspace #intro").hide();
                                    showDataset(data);
                                }*/

                                //hide function buttons
                                $(".type-instructions." + type + " .functions .options").hide();
                                //show analysis and visualization page
                                $(".type-instructions.analysis, .type-instructions.visualization").show();
                                if(params['return_all_data']){
                                    //then this can be put in cache
                                    that.setCurrentWorkingSet(data, true);
                                }
                                else {
                                    that.setCurrentWorkingSet(data, false);
                                }
                                //if this was a collection type, show output meta and move onto analysis stage
                                //if this was an analysis type, show output and additional analysis options
                            },
                            complete: function(jqXHR, stat){
                                console.log("Complete: " + stat);
                                UI.toggleLoader(false);
                            }
                        });
                    }
                });
                //add listeners for buttons (selects #collection a, #analysis a, etc.)

                $("#home").on("click", function() {
                    clear();
                    $("#intro").fadeIn();
                });

                //Click on Modules
                $(".type-instructions .modules .options").on("click", function(e){ //choose social media
                    e.preventDefault();
                    var a = $(this),
                        type = a.attr("data-type"),
                        mod = a.attr("data-mod");
                    var typ = $(".type-instructions." + type); //(.type-instructions .collection)
                    //hide all sub menus and forms
                    //typ.find(".mod > .chosen").html(mod); //adds the name of mod below the list
                    //typ.find(".fn").fadeIn(); //"choose function" appears

                    $("#forms-c .function, #forms-a .function, #forms-v .function, .functions .options").hide(); //hides all forms and buttons (questions)
                    if(type != "collection") {
                        //hide card titles for analysis & visualization
                        $(".tool-title").hide();
                    }
                    //hide card & modal titles
                    $("#fn-collection, #fn-analysis, #fn-visualization").html("");
                    //show buttons and the modal
                    typ.find(".functions .options[data-type=" + type + "][data-mod=" + mod + "]").fadeIn(); //show all collection functions available for that specific social media
                    $("#submit-c, #submit-a, #submit-v").hide();
                    //check if submit button has attributes ---what about analysis or visualization???
                    if ($("#submit-c, #submit-a, #submit-v").attr("submit-type") != undefined ); { //if the submit button has attributes
                        $(this).removeAttr("submit-type submit-mod submit-fn");
                    }


                    if(type == 'collection') {
                        $('#modal-collection').modal('show')
                    }
                    else { //for analysis/visualization
                    }

                });

                //Click on Function Button
                $(".type-instructions .functions .options, .type-instructions .sub.fn").on("click", function(e){ //if you click on any of the function buttons or the choose list button
                    e.preventDefault();
                    var a = $(this),
                        type = a.attr("data-type"),
                        mod = a.attr("data-mod"),
                        fn = a.attr("data-fn"),
                        name = a.attr("name");
                    $(".type-instructions." + type + " .fn > .chosen").html(fn);
                    //hide sub menu and forms
                    //$(".type-instructions .functions .button, #forms .function").hide();
                    $("#forms-c .function, #forms-a .function, #forms-v .function").hide();
                    $("#fn-collection, #fn-analysis, #fn-visualization").html("");

                    console.log(type=="collection");
                    if(type == "collection") {
                        $("#fn-collection").append("<h5>" + name + "<h5>");
                        $("#forms-c .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
                        console.log("done");

                        //add attributes to the submit button
                        $("#submit-c").attr({
                            "submit-type": type,
                            "submit-mod": mod,
                            "submit-fn": fn
                        });
                        $("#submit-c").show();
                    }
                    else if(type == "analysis") {
                        $("#fn-analysis").html(name);
                        $("#forms-a .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
                        $("#submit-a").attr({
                            "submit-type": type,
                            "submit-mod": mod,
                            "submit-fn": fn,
                            "name": name
                        });
                        $("#submit-a").show();

                    }
                    else { //type==visualization
                        $("#fn-visualization").html(name);
                        $("#forms-v .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
                        $("#submit-v").attr({
                            "submit-type": type,
                            "submit-mod": mod,
                            "submit-fn": fn,
                            "name": name
                        });
                        $("#submit-v").show();
                    }

                    //$("#forms .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
                });

                $(".fieldChooser").click(function(){
                    var fType = $(this).attr("data-fieldtype");
                    curChooser = $(this);
                    showFields(fType);
                });

                //when u click on a field?
                $("#workspace").delegate(".field.selected", "click" ,function(){
                    if(curChooser != null){
                        //set input
                        var type = $(this).attr('data-type');
                        var finalStr = $(this).html();
                        curChooser.html(finalStr);
                        if(type == "analysis"){
                            finalStr = "analysis[" + $(this).attr("data-index") + "]." + finalStr;
                        }
                        curChooser.siblings("input").val(finalStr);
                        showFields(null);
                    }
                });

                showType("collection"); //initially show collection
            }
        });

        $("#download").click(function(e){
            e.preventDefault();
            $("#view textarea, #view #close").fadeIn();
            $.ajax({
                url: UTIL.CFG.api_endpoint + "fetch",
                dataType: "json",
                type: "GET",
                data: {'working_set_id': $("#view #refID").val(), 'returnAllData': "true"},
                success : function(data, stat, jqXHR){
                    that.setCurrentWorkingSet(data);
                    $("#view textarea").html(JSON.stringify(data));
                },
            });
        });

        $("#close").click(function(e){
            e.preventDefault();
            $(this).fadeOut();
            $("#view textarea").fadeOut();
        });

        $("#topbar .c").click(function(){
            showType("collection");
            $("#topbar .item").removeClass("active");
            $(this).addClass("active");
        });

        $("#topbar .a").click(function(){
            showType("analysis");
            $("#topbar .item").removeClass("active");
            $(this).addClass("active");
        });

        $("#topbar .v").click(function(){
            showType("visualization");
            $("#topbar .item").removeClass("active");
            $(this).addClass("active");
        });

        $("#clearDashboard").on("click", clear);

        $(".sub.mod, .sub.fn").on("click", function(){
            $(this).find(".chosen").html(""); //remove chosen function/module
            showType($(this).attr("data-type"));
            $("#topbar .item").removeClass("active");
            $("#topbar .item.c").addClass("active");
        });

        $("a.more").on("click", function(){
            //$('.tool-title').show();
            if($(this).attr("data-type") == "a"){
                $("#fn-analysis").empty();
                $("#forms-a .function, .type-instructions.analysis .functions .options").hide(); //hides all forms and buttons (questions)
                $("#submit-a").hide();
                $(".type-instructions.analysis .modules .options").show();
                $(".type-instructions.analysis .card").fadeIn();
            }
            else{
                $("#fn-visualization").empty();
                $("#forms-v .function, .type-instructions.visualization .functions .options").hide(); //hides all forms and buttons (questions)
                $("#submit-v").hide();
                $(".type-instructions.visualization .modules .options").show();
                $(".type-instructions.visualization .card").fadeIn();
            }
        });

        $.ajax({
            url : "https://api.github.com/repos/InfoSeeking/Socrates",
            dataType: "json",
            contentType: "application/json",
            success : function(json){
                console.log(json);
                var dateStr = json.pushed_at + "";
                $("#last-modified").html("SOCRATES last updated on " + dateStr.replace(/[TZ]/g, ' '));
            }
        });

        $("#settings-btn").click(function(){
            if (UI.isLoggedIn()){
                UI.switchScreen("settings");
            }
        });

        $("#import-btn").click(function(){
            $("#fileupload").click();
        });

        $("#showAllData").on("click", handleDataButton);
    }
    /*
    Shows the overlay with a table of your data. (can be collection only, collection + single analysis, or collection + every analysis)
    index only necessary if it is an analysis type
    */


    function clear() {
        $("#workspace table, .completed.analysis, .completed.visualization").empty(); //clear dataset
        $("#fn-analysis, #fn-visualization").empty();
        $(".type-instructions.analysis .modules .options, .type-instructions.analysis .functions .options, .type-instructions.visualization .modules .options, .type-instructions.visualization .functions .options").hide();
        $("#submit-a, #submit-v").hide();
        $("#overlay, #forms-a .function, #forms-v .function, .type-instructions.analysis .card, .type-instructions.visualization .card").hide();
        $(".type-instructions.analysis, .type-instructions.visualization, #intro").hide();
    }
    //.modules .options

    function showDataset(working_set){
        //console.log("Showing data for " + typ + "," + index);
        $("#intro").hide();
        var ws = working_set;//easier
        var aData = ws['analysis'];
        console.log(ws);
        var table = $("<table class='table'></table>");
        var thead = $("<thead></thead>");
        var tbody = $("<tbody></tbody>");

        var cData = ws["data"];
        //build the top row
        var headRow = $("<tr></tr>")
        headRow.append("<th>Index</th>");
        for(var f in ws["meta"]){
            if(ws["meta"].hasOwnProperty(f)){
                headRow.append("<th class='field' data-type='collection' data-fieldtype='" + ws["meta"][f] + "'>" + f + "</th>");
            }
        }

        //add heading for every analysis
        if(aData){
            for(var i = 0; i < aData.length; i++){
                for(var f in aData[i]["entry_meta"]){
                    if(aData[i]["entry_meta"].hasOwnProperty(f)){
                        headRow.append("<th class='a'>" + f + "</th>");
                    }
                }
            }
        }
        tbody.append(thead.append(headRow));

        for(var i = 0; i < cData.length; i++){
            var row = $("<tr><td> " + i + "</td></tr>");
            for(var f in ws["meta"]){
                if(ws["meta"].hasOwnProperty(f)){
                    row.append("<td>" + cData[i][f] + "</td>");
                }
            }
            if(aData){
                for(var j = 0; j < aData.length; j++){
                    for(var f in aData[j]["entry_meta"]){
                        if(aData[j]["entry_meta"].hasOwnProperty(f)){
                            row.append("<td class='a'>" + aData[j]["entry_analysis"][f][i] + "</td>");
                        }
                    }
                }
            }
            tbody.append(row);
        }
        /*if(typ == "analysis"){
            //show the entry data alongside collection data
            if(index !== undefined){
                //show only one
                aData = new Array(ws["analysis"][index]);
            }
            else{
                aData = ws["analysis"];
            }
        }*/


        //now add rows
        var html = $("<table class='table table-hover table-responsive'></table>").empty().append(thead).append(tbody);
        //console.log(html.html());
        UI.overlay(html, "data", "Your Data");
        //console.log(html.html());
    }

    function handleDataButton(typ){
        UI.toggleLoader(true);
        //var btn = $(this); //show all data button
        //console.log(btn.html());
        that.getWorkingSet(that.getCurrentWorkingSetID(), function(ws){
            //var typ = btn.attr("data-type");
            //var index = btn.attr("data-index");
            var index = undefined;
            if(index){
                index = parseInt(index);
            }
            console.log(index);
            showAllData(ws, typ, index);
            UI.toggleLoader(false);
        })
        //e.preventDefault();
    }

    function showAllDataBtn(){
        return $("<a href='#' class='button'>Show All of this Data</a>").on("click", handleDataButton);
    }

    function showType(type){
        $(".type-instructions.analysis, .type-instructions.visualization").hide();
        var typ = $(".type-instructions." + type).show(); //show specific type
        typ.find(".sub.mod").show();
        console.log(typ.find(".button")); //returns all buttons
        //typ.find(".sub.fn").hide(); //hide the sub list
        typ.find(".button").hide(); //hide all buttons
        typ.find(".modules .button").show(); //resets and shows social media buttons
    }

    //only for analysis and visualization
    function createTable(type, set, fn_name){
        console.log(set);
        var section;
        if(type == "collection"){
            var table = $("<table></table>");
            table.append("<thead><tr><th>Field</th><th>Type</th><th>Sample (from first entry)</th></tr></thead><tbody></tbody>");
            for(var field in set.meta){
                if(!set.meta.hasOwnProperty(field)){continue;}
                    var type = set.meta[field];
                    if(typeof(type) == "object"){
                        type = type.type;//lol
                    }
                    var sample = "";
                    if(set.data.length > 0){
                        sample = set.data[0][field];
                    }
                else{
                    return section;
                }
                if((typeof(sample) == "string") && sample.length > 30){
                    sample = sample.substring(0, 30) + "...";
                }
                var row = $("<tr><td><span class='field' data-type='collection' data-fieldtype='" + type + "'>" + field + "</span></td><td>" + type + "</td><td>" + sample + "</td></tr>");
                table.find("tbody").append(row);
                section = table;
            }
        }
        else if(type == "analysis"){
            var index = set.analysis.length - 1;
            var an = set.analysis[index];
            var a_section = $("<div class='analysis_section card-body'></div>");
            if(an.hasOwnProperty("aggregate_meta")){
                //check for aggregate data
                a_section.append("<h4>Aggregate Data</h4>");
                var table = $("<table></table>");
                table.append("<thead><tr><th>Field</th><th>Type</th><th>Value</th></tr></thead><tbody></tbody>");
                for(var field in an.aggregate_meta){
                    if(!an.aggregate_meta.hasOwnProperty(field)){continue;}
                    var type = an.aggregate_meta[field];
                    if(typeof(type) == "object"){
                        type = type.type;//lol
                    }
                    var sample = an.aggregate_analysis[field];
                    var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
                    table.find("tbody").append(row);
                }
                a_section.append(table);
            }

            if(an.hasOwnProperty("entry_meta")){
                //show entry data
                a_section.append("<h4 class='card-title'>" + fn_name +"</h4>");
                var table = $("<table></table>");
                table.append("<thead><tr><th>Field</th><th>Type</th><th>Sample (from first entry)</th></tr></thead><tbody></tbody>");
                for(var field in an.entry_meta){
                    if(!an.entry_meta.hasOwnProperty(field)){continue;}
                    var type = an.entry_meta[field];
                    if(typeof(type) == "object"){
                        type = type.type;//lol
                    }
                    var sample = "";
                    if(an.entry_analysis[field].length > 0){
                        sample = an.entry_analysis[field][0];
                    }
                    var row = $("<tr><td><span class='field' data-type='analysis' data-index='" + index + "' data-fieldtype='" + type + "'>" + field + "</span></td><td>" + type + "</td><td>" + sample + "</td></tr>");
                    table.find("tbody").append(row);
                }
                a_section.append(table);
            }
            section = a_section;
        }
        return section;
    }

    function createBox(type, index){
        //create a new empty box
        return $("<div style='display:none;' class='results " + type + " card'></div>");
    }

    function createResultCard(type, index){
        //create a new empty box
        return $("<div style='display:none;' class='results " + type + " card border-light'></div>");
    }

    function downloadButtonFunction(downloadFunction){
        var btn = $(this);
        UI.toggleLoader(true);
        that.getWorkingSet(that.getCurrentWorkingSetID(), function(ws){
            var typ = btn.attr("data-type");
            var index = btn.attr("data-index");
            if(index){
                index = parseInt(index);
            }
            downloadFunction(that.getCurrentWorkingSetID());
            UI.toggleLoader(false);
        });
    }

    //activated when download dataset as json button is clicked
    function onDownloadDatasetJSONButtonClicked(){
        downloadButtonFunction(that.downloadDatasetJSON);
    }

    //activated when download dataset as csv button is clicked
    function onDownloadDatasetCSVButtonClicked(){
        downloadButtonFunction(that.downloadDatasetCSV);
    }

    //activated when download workflow button is clicked
    function onDownloadWorkflowButtonClicked(){
        downloadButtonFunction(that.downloadWorkingSet);
    }

    function removeData(){
        $("#data-list").toggleClass("remove");
    }

    function closeBoxButton(){
        return $("<a class='button close'>X</a>").click(closeBox);
    }

    function manageDownloadButtons(){
        var count = $('.results.analysis').length //counts how many analyses there are
        if (count!=0){
            //shows download workflow button
            $("#entireworkflow").css("display", "block");
        }
        else{
            $("#entireworkflow").css("display", "none");
        }
        var ct = $('.results.collection').length //counts how many collections there are
        if (ct!=0){
            //show download dataset buttons
            $("#datasetjson").css("display", "block");
            $("#datasetcsv").css("display", "block");
        }
        else{
            $("#datasetjson").css("display", "none");
            $("#datasetcsv").css("display", "none");
        }
    }

    function closeBox(){
        //add confirmation check whether to continue or not
        if(confirm("Are you sure to want to delete this?")){
            $(this).parent().parent().detach();
        }
        manageDownloadButtons(); //check whether to show or hide buttons
    }

    function csvesc(txt){
        return ("" + txt).replace(/,|\n/g, "");
    }

    function downloadBoxXML(working_set){
        var xml = "<XML>";
        xml += json2xml(working_set);
        xml += "</XML>"

        var win = window.open("data:application/csv;charset=utf8," + encodeURIComponent(xml), "_blank");
    }

    function downloadBoxjson(working_set){
        var json = JSON.stringify(working_set);
        var win = window.open("data:application/csv;charset=utf8," + encodeURIComponent(json), "_blank");
    }

    function downloadBoxtsv(working_set, typ, index){
        var aData = null;
        var ws = working_set;//easier
        var tsv = "";
        if(typ == "analysis"){
            //show the entry data alongside collection data
            if(index !== null){
                //show only one
                aData = new Array(ws["analysis"][index]);
            }
            else{
                aData = ws["analysis"];
            }
        }

        var cData = ws["data"];
        //build the top row
        var thead = $("<tr><th>Index</th></tr>");
        var first = true;
        for(var f in ws["meta"]){
            if(ws["meta"].hasOwnProperty(f)){
                if(first){
                    first = false;
                }
                else{
                    tsv += "\t";
                }
                tsv += csvesc(f);
            }
        }
        //add heading for every analysis
        if(aData){
            for(var i = 0; i < aData.length; i++){
                for(var f in aData[i]["entry_meta"]){
                    if(aData[i]["entry_meta"].hasOwnProperty(f)){
                        tsv += "\t" + csvesc(f);
                    }
                }
            }
        }
        tsv += "\n";
        for(var i = 0; i < cData.length; i++){
            var row = $("<tr><td> " + i + "</td></tr>");
            first = true;
            for(var f in ws["meta"]){
                if(ws["meta"].hasOwnProperty(f)){
                    if(first){
                        first = false;
                    }
                    else{
                        tsv += "\t";
                    }
                    tsv += csvesc(cData[i][f]);
                }
            }
            if(aData){
                for(var j = 0; j < aData.length; j++){
                    for(var f in aData[j]["entry_meta"]){
                        if(aData[j]["entry_meta"].hasOwnProperty(f)){
                            tsv += "\t" + csvesc(aData[j]["entry_analysis"][f][i]);
                        }
                    }
                }
            }
            tsv += "\n";
        }
        var win = window.open("data:application/tsv;charset=utf8," + encodeURIComponent(tsv), "_blank");
    }

    function downloadBoxcsv(working_set, typ, index){
        var aData = null;
        var ws = working_set;//easier
        var csv = "";
        if(typ == "analysis"){
            //show the entry data alongside collection data
            if(index !== null){
                //show only one
                aData = new Array(ws["analysis"][index]);
            }
            else{
                aData = ws["analysis"];
            }
        }
        var cData = ws["data"];
        //build the top row
        var thead = $("<tr><th>Index</th></tr>");
        var first = true;
        for(var f in ws["meta"]){
            if(ws["meta"].hasOwnProperty(f)){
                if(first) {
                    first = false;
                }
                else {
                    csv += ",";
                }
                csv += csvesc(f);
            }
        }
        //add heading for every analysis
        if(aData){
            for(var i = 0; i < aData.length; i++){
                for(var f in aData[i]["entry_meta"]){
                    if(aData[i]["entry_meta"].hasOwnProperty(f)){
                        csv += "," + csvesc(f);
                    }
                }
            }
        }
        csv += "\n";
        for(var i = 0; i < cData.length; i++){
            var row = $("<tr><td> " + i + "</td></tr>");
            first = true;
            for(var f in ws["meta"]){
                if(ws["meta"].hasOwnProperty(f)){
                    if(first){
                        first = false;
                    }
                else{
                    csv += ",";
                }
                csv += csvesc(cData[i][f]);
                }
            }
            if(aData){
                for(var j = 0; j < aData.length; j++){
                    for(var f in aData[j]["entry_meta"]){
                        if(aData[j]["entry_meta"].hasOwnProperty(f)){
                            csv += "," + csvesc(aData[j]["entry_analysis"][f][i]);
                        }
                    }
                }
            }
            csv += "\n";
        }
        var win = window.open("data:application/csv;charset=utf8," + encodeURIComponent(csv), "_blank");
    }

    that.showWorkingSet = function(working_set, name){
        that.setCurrentWorkingSet(working_set);
        //clear current working set area
        clear();
        console.log(working_set);
        //add box for collection
        showResults(working_set, "collection");
        handleDataButton("collection");
        //add box for each analysis
        if(working_set.analysis){
            for(var i = 0; i < working_set.analysis.length; i++){
                showResults(working_set, "analysis", i);
            }
        }
        if (working_set.visualization) {
            for(var i = 0; i < working_set.visualization.length; i++){
                showVisualization(working_set, i);
            }
            $('.completed.visualization .card').show();

        }
        $(".type-instructions.analysis, .type-instructions.visualization").show();
        //passCollectionPhase();
    };

    that.showSavedWorkFlow = function(working_set) {
        that.setCurrentWorkingSet(working_set);
        clear();
        console.log(working_set);
        showDataset(working_set);
        if(working_set.analysis) {
            for (var i = 0; i < working_set.analysis.length; i++) {
                showSummary(working_set, i);
            }
        }
        if (working_set.visualization) {
            for(var i = 0; i < working_set.visualization.length; i++){
                showVisualization(working_set, i);
            }
            $('.completed.visualization .card').show();
        }
        $(".type-instructions.analysis, .type-instructions.visualization").show();
    };

    /*
    Given the working_set, it will create a new box for the most recently created data.
    */
    function showResults(working_set, type, analysis_index, fn_name){
        console.log(fn_name);
        var setName = working_set["working_set_name"];
        $("#workspace #intro").hide(); //.detach()
        //if type is collection, add collection data
        //if type is analysis, add most recent analysis
        var card = createResultCard(type);
        var box = createBox(type);
        var h2 = box.find("h2");
        if(type == "collection"){
            that.setCurrentWorkingSet(working_set);
            //$("#download-json").attr("href", CFG.host + "/fetch/" + curRefId).show();
            h2.html("Collection");
            h2.append(" (" + setName + ")");
            var table = createTable(type, working_set);//this is the HTML created table
            box.append(table);
            box.append(showAllDataBtn().attr("data-type", "collection"));
            // box.append(getDownloadButton().attr("data-type", "collection"));
            $("#workspace").append(box);
        }
        else if(type == "analysis") {
            /*h2.html("Analysis");
            h2.parent().append(closeBoxButton());
            box.append(createTable(type, working_set, fn_name));
            var curIndex = working_set["analysis"].length - 1;
            if(analysis_index !== undefined){
                curIndex = analysis_index;
            }
            console.log("Showing " + curIndex);
            if(working_set["analysis"][curIndex].hasOwnProperty("entry_meta")){
                box.append(showAllDataBtn().attr("data-type", "analysis").attr('data-index', curIndex));
                // box.append(getDownloadButton().attr("data-type", "analysis").attr('data-index', curIndex));
            }*/
            showSummary(working_set, type, analysis_index, fn_name);
        }

        else if(type == "upload"){
            h2.html("Imported Data");
            h2.append(" (" + setName + ")");
            h2.parent().append(closeBoxButton());
            var table = createTable(type, working_set);//this is the HTML created table
            box.append(table);
            box.append(showAllDataBtn().attr("data-type", "collection"));
            // box.append(getDownloadButton().attr("data-type", "collection"));
        }
        manageDownloadButtons();

        //box.hide().fadeIn();
    }

    /*function showDataset(working_set) {
        that.setCurrentWorkingSet(working_set);
        that.getWorkingSet(that.getCurrentWorkingSetID(), function(ws) {
            showAllData(ws, "collection");
        });
    }*/

    function showSummary(working_set, analysis_index) {
        if(showResults.first) {
            showResults.first = false;
        }
        var card = createResultCard(type);
        var card_body = $("<div class='analysis_section card-body'></div>");
        if(analysis_index == undefined){ //you need to get the index of the recently added analysis
            analysis_index = working_set["analysis"].length - 1;
        }
        var aData = working_set['analysis'][analysis_index];
        card.append("<h4 class='card-header'>"+ aData['fn_name'] +"</h4>");

        if(aData['aggregate_meta']) {
            card_body.append("<h5 class='card-title' style='text-align:left;'>Aggregate Data</h5>");
            var table = $("<table class='table table-light table-sm'></table>");
            table.append("<thead><tr><th>Field</th><th>Type</th><th>Value</th></tr></thead>");
            var table_body = $("<tbody></tbody>");
            for(var field in aData.aggregate_meta){
                var type = aData['aggregate_meta'][field];
                if(typeof(type) == "object"){
                    type = type.type;//lol
                }
                var values = aData['aggregate_analysis'][field];
                var row = $("<tr><th>" + field + "</th><td>" + type + "</td><td>" + values + "</td></tr>");
                table_body.append(row);
            }
            card.append(card_body.append(table.append(table_body)));
        }

        if(aData.entry_meta) {
            card_body.append("<h5 class='card-title' style='text-align:left;'>Results</h5>");
            var table = $("<table class='table table-light table-sm'></table>");
            table.append("<thead><tr><th>Field</th><th>Type</th><th>Sample (from first entry)</th></tr></thead>");
            var table_body = $("<tbody></tbody>");
            for(var field in aData.entry_meta) {
                var type = aData['entry_meta'][field];
                if(typeof(type) == "object"){
                    type = type.type;//lol
                }
                var sample = aData['entry_analysis'][field][0];
                var row = $("<tr><th>" + field + "</th><td>" + type + "</td><td>" + sample + "</td></tr>");
                table_body.append(row);
            }
            card.append(card_body.append(table.append(table_body)));
        }

        console.log("Showing " + analysis_index);
        $(".completed.analysis").append(card);
        card.hide().fadeIn();
    }

    function showVisualization(working_set, index) {
        console.log('hello');
        var ws = working_set;
        var data = ws['data'];
        var vis_data = ws['visualization'];
        //console.log(vis_data);
        var selected_data = [];

        if(index == undefined && vis_data.length != 0) { //if you're adding new vis
            index = vis_data.length-1; //get the most recent vis data
        }
        var input = vis_data[index]['input'];
        var fn = vis_data[index]['function'];
        var field = '', x_field='', y_field='', id = '';
        if(fn == 'histogram' || fn == 'piechart') {
            field = input['field'];
            id = fn + '_' + field;
        }
        else {
            x_field = input['x-field'];
            y_field = input['y-field'];
            id = fn + '_' + x_field + '_' + y_field;
        }

        var duplicate = document.getElementById(id);
        if(duplicate) {
            return;
        }

        //create result card
        var card = createResultCard('visualization');
        $(".completed.visualization").append(card);
        card.append("<div class='card-body'><h4 class='card-title'>" + fn +"</h4><div><canvas id='" + id + "'></canvas></div></div>");


        if(fn == 'histogram') {
            console.log(field);
            var index = [];

            for (var p = 0; p < data.length; p++) {
                index.push(p);
                selected_data.push(data[p][field]); //create an array of selected data
            }
            console.log(selected_data);
            $(document).ready(function() {
                var myChart = document.getElementById(id).getContext('2d');
                var newChart = new Chart(myChart, {
                    type: 'bar',

                    data: {
                        labels: index,
                        datasets: [{
                            label: field,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: selected_data
                        }]
                    },
                    // Configuration options go here
                    options: {}
                })
            })


        }

        else if(fn == 'scatterplot') {
            var index = [];
            var dict = [];
            for (var i = 0; i<data.length; i++) {
                index.push(i);
                var point = {
                    x: data[i][x_field],
                    y: data[i][y_field]
                };
                console.log(point);
                dict.push(point);
            }
            console.log(dict);

            //create chart
            $(document).ready(function() {
                var myChart = document.getElementById(id).getContext('2d');
                var newChart = new Chart(myChart, {
                    type: 'scatter',
                    // The data for our dataset
                    data: {
                        //label: index,
                        datasets: [{
                            label: '('+x_field + ', ' + y_field+')',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: dict
                        }]
                    },
                    // Configuration options go here
                    options: {}
                })
            })
        }

        else if (fn == 'piechart') {
            var index = [];

            for (var p = 0; p < data.length; p++) {
                index.push(p);
                selected_data.push(data[p][field]); //create an array of selected data
            }
            var map = {};//map from label to count
            for(var i = 0; i < selected_data.length; i++){
                var v = selected_data[i];
                if(!map.hasOwnProperty(v)){
                    map[v] = 1;
                }
                else{
                    map[v]++;
                }
            }
            console.log(map);
            var labels = Object.keys(map);
            var values = Object.values(map);
            console.log(labels);
            console.log(values);

            //create chart
            $(document).ready(function() {
                var myChart = document.getElementById(id).getContext('2d');
                var newChart = new Chart(myChart, {
                    type: 'pie',
                    // The data for our dataset
                    data: {
                        labels: labels,
                        datasets: [{
                            label: field,
                            data: values
                        }]
                    },
                    // Configuration options go here
                    options: {}
                });

            });
        }

        else if (fn == 'regression') {
            var index = [];
            var dict = [];
            var x = [];
            var y = [];
            for (var i = 0; i<data.length; i++) {
                index.push(i);
                var point = {
                    x: data[i][x_field],
                    y: data[i][y_field]
                };
                console.log(point);
                dict.push(point);
                x.push(data[i][x_field]);
                y.push(data[i][y_field]);
            }
            console.log(dict);

            //var x = params['input']["x-field"]; //arrays of equal length corresponding to (x,y) points
            //var y = params['input']["y-field"];
            var sumX = 0;
            var sumY = 0;
            var sumX2 = 0;
            var sumY2 = 0;
            var sumXY = 0;
            for (var i = 0; i < x.length; i++){
                sumX += x[i];
                sumY += y[i];
                sumX2 += x[i] * x[i];
                sumY2 += y[i] * y[i];
                sumXY += x[i] * y[i];
            }
            var a_value = (1.0*sumY*sumX2 - sumX*sumXY)/(x.length*sumX2 - sumX*sumX);
            var b_value = (1.0*x.length*sumXY - sumX*sumY)/(x.length*sumX2 - sumX*sumX);
            //end regression values

            //two set of points for plotting line
            var min = Math.min.apply(null, x);
            var	max = Math.max.apply(null, x);
            var	min_output = a_value + min*b_value;
            var max_output = a_value + max*b_value;
            var y_data = [min_output, max_output];
            var lineData = 	[{"x": min, "y": min_output}, {"x": max, "y": max_output}];


            //create chart
            $(document).ready(function() {
                var myChart = document.getElementById(id).getContext('2d');
                var newChart = new Chart(myChart, {
                    type: 'scatter',

                    // The data for our dataset
                    data: {
                        datasets: [{
                            label: '('+x_field + ', ' + y_field+')',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: dict
                        }, {
                            type: 'line',
                            label: 'Linear Regression',
                            data: lineData,
                            showLine: true,
                            fill: false
                         }]
                    },
                    // Configuration options go here
                    options: {
                    }
                })
            })
        }
    }

    /*
    data should be an object containing fields
    fields can either be strings or objects
    ordering is an array of the field names (optional)
    */
    function genForm(data, type, ordering){
        console.log(data);
        var form = $("<form style='text-align:left'></form>");
        if(type == "analysis" || type == "visualization"){
            //add reference to database
            //form.append("<div class='row'><label>Reference ID</label><input type='text' class='toSend' name='reference_id'/></div>");
        }
        if(!ordering){
            //get the keys from data
            ordering = [];
            for(var p in data){
                if(data.hasOwnProperty(p)){
                    ordering.push(p);
                }
            }
        }
        console.log(ordering);
        var id=0;
        for(var n = 0; n < ordering.length; n++){
            var p = ordering[n];
            if(!data.hasOwnProperty(p)){continue;}
            var row = $("<div class='form-group row'></div>");
            var input = null;
            //var inputType = "text";
            var fieldType = "";
            //var extra = "";
            var div = $("<div class='col-sm-8'></div>")
            if(typeof(data[p]) == "string"){
                fieldType = data[p];
            }
            else if(typeof(data[p] == "object")){
                fieldType = data[p].type;
            }
            switch(fieldType){
                case "numeric":
                    input = $("<input type='number' class='form-control' step='any'/>");
                    break;
                case "boolean":
                    input = $("<select class='form-control'><option value='true'>True</option><option value='false'>False</option></select>");
                    break;
                default:
                    input = $("<input type='text' class='form-control'/>");
                    break;
            }
            var fr = /^field_reference\s+(\w+)$/i;
            var match = fr.exec(fieldType);
            if(match){
                input = $("<input type='hidden'/><span class='fieldChooser' data-fieldtype='" + match[1] + "'>Choose a Field</span>");
            }

            if(typeof(data[p] == "object")){
                console.log(data[p]);
                //check other options
                var hasComment = false;
                var comment = $("<small class='text-muted' id='" + id + "'></small>");
                var optional = "";
                if(data[p].hasOwnProperty("optional") && data[p]["optional"]){
                    hasComment = true;
                    comment.html("optional");
                    //add id to input
                    input.attr('aria-describedby', id);
                    id++;
                }
                if(data[p].hasOwnProperty("comment")){
                    hasComment = true;
                    comment.html(data[p]["comment"]);
                    if(data[p]["type"] == "field_reference numeric" || data[p]["type"] == "field_reference text") { //make sure the comment is below the input box
                        comment.addClass("form-text");
                    }
                    input.attr('aria-describedby', id);
                    id++;
                }
                if(hasComment){
                    div.append(comment);
                }
                if(data[p].hasOwnProperty("constraints")){
                    if(data[p].constraints.hasOwnProperty("choices")){
                        var choices = data[p].constraints.choices;
                        //create select field
                        input = $("<select class='form-control'></select>");
                        for(var i = 0; i < choices.length; i++){
                            input.append("<option value='" + choices[i] + "'>" + choices[i] + "</option>");
                        }
                    }
                }
                if(data[p].hasOwnProperty("default")){
                    //only works for text/numeric fields right now, create a new method to set value
                    input.val(data[p]["default"]);
                }
            }

            input.addClass("toSend").attr("name", p);
            div.prepend(input);
            row.prepend(div).prepend("<label for='" + p + "' class='col-sm-4 col-form-label'>" + p + "</label>");//use prepend in case comments were added
            form.append(row);
        }
        //form.append("<input type='submit' class='button' />");
        if (type == "collection"){
            //injection of dataset name field (ehh...)
            form.prepend("<div class='form-group row'><label for='setName' class='col-sm-4 col-form-label'>Dataset Name</label><div class='col-sm-8'><input type='text' class='form-control' id='setName' value='Untitled' aria-describedby='optional'><small id='optional' class='text-muted'>optional</small></div></div>")
        }
        return form;
    }

    function showFields(type){
        $(".field").removeClass("selected");
        if(type !== null){
            $(".field[data-fieldtype=" + type + "]").addClass("selected");
        }
    }

    function json2xml(o, tab) {
      /*  This work is licensed under Creative Commons GNU LGPL License.

      License: http://creativecommons.org/licenses/LGPL/2.1/
       Version: 0.9
      Author:  Stefan Goessner/2006
      Web:     http://goessner.net/
    */
       var toXml = function(v, name, ind) {
          var xml = "";
          if (v instanceof Array) {
             for (var i=0, n=v.length; i<n; i++)
                xml += ind + toXml(v[i], name, ind+"\t") + "\n";
          }
          else if (typeof(v) == "object") {
             var hasChild = false;
             xml += ind + "<" + name;
             for (var m in v) {
                if (m.charAt(0) == "@")
                   xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                   hasChild = true;
             }
             xml += hasChild ? ">" : "/>";
             if (hasChild) {
                for (var m in v) {
                   if (m == "#text")
                      xml += v[m];
                   else if (m == "#cdata")
                      xml += "<![CDATA[" + v[m] + "]]>";
                   else if (m.charAt(0) != "@")
                      xml += toXml(v[m], m, ind+"\t");
                }
                xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
             }
          }
          else {
             xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
          }
          return xml;
       }, xml="";
       for (var m in o)
          xml += toXml(o[m], m, "");
       return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
    };

    return that;
}());

MainScreen.prototype = Screen;
