var curRefId = null;
var curChooser = null;//current field chooser
var sidebar = "default";

/*
show overlay with html and center
*/
function overlay(html, classname, title){
  $("#overlay span").html(title).removeClass().addClass(classname);
  $("#overlay .content").empty().html(html);
  $("#overlay").fadeIn();
}
/*
toggle loader
*/
function tLoad(val){
  if(val){
    $("#loader").show();
  }
  else{
    $("#loader").hide();
  }
}

$("#overlay .close").on("click", function(){
  $("#overlay").hide();
});

/*
Shows the overlay with a table of your data. (can be collection only, collection + single analysis, or collection + every analysis)
index only necessary if it is an analysis type
*/
function showAllData(working_set, typ, index){
  console.log("Showing data for " + typ + "," + index);
  var aData = null;
  var ws = working_set;//easier
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
  for(var f in ws["meta"]){
    if(ws["meta"].hasOwnProperty(f)){
      thead.append("<th>" + f + "</th>");
    }
  }
  //add heading for every analysis
  if(aData){
    console.log(aData);
    for(var i = 0; i < aData.length; i++){
      for(var f in aData[i]["entry_meta"]){
        if(aData[i]["entry_meta"].hasOwnProperty(f)){
          thead.append("<th class='a'>" + f + "</th>");
        }
      }
    }
  }
  var tbody = $("<tbody></tbody>");
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

  //now add rows
  var html = $("<table></table>").empty().append(thead).append(tbody);
  overlay(html, "data", "Your Data");
}

function handleDataButton(e){
  tLoad(true);
  var btn = $(this);
  getWorkingSet(curRefId, function(ws){
      var typ = btn.attr("data-type");
      var index = btn.attr("data-index");
      if(index){
        index = parseInt(index);
      }
      showAllData(ws, typ, index);
      
      tLoad(false);
  })

  e.preventDefault();
}
function showAllDataBtn(){
  return $("<a href='#' class='button'>Show All of this Data</a>").on("click", handleDataButton);
}

function showType(type){
  $(".type-instructions").hide();
  var typ = $(".type-instructions." + type).show();
  typ.find(".sub.mod").show();
  console.log(typ.find(".button"));
  typ.find(".sub.fn").hide();
  typ.find(".button").hide();
  typ.find(".modules .button").show();
}

function createTable(type, set){
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
    var a_section = $("<div class='analysis_section'></div>");
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
      a_section.append("<h4>Entry Data</h4>");
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
  return $("<div class='results " + type + "'><div class='bar'><h2></h2></div></div>");
}


function onDownloadButtonClicked(){
  var btn = $(this);
  tLoad(true);
  getWorkingSet(curRefId, function(ws){
    var typ = btn.attr("data-type");
    var index = btn.attr("data-index");
    if(index){
      index = parseInt(index);
    }

    if(document.getElementById('dJSON').checked){
      console.log("downloading in json");
      downloadBoxjson(ws);
    }
    else if (document.getElementById('dCSV').checked){
      console.log("downloading in csv");
      downloadBoxcsv(ws, typ, index);
    } 
    else if (document.getElementById('dXML').checked){
      console.log("downloading in xml");
      downloadBoxXML(ws, typ, index);
    }
    else{
      console.log("downloading in tsv");
      downloadBoxtsv(ws, typ, index);
    }
  
    tLoad(false);
  });
}

function getDownloadButton(){
	return $("<a class='button'>Download</a>").click(onDownloadButtonClicked);
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
      if(first){
        first = false;
      }
      else{
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
/*
  Given the working_set, it will create a new box for the most recently created data.
*/
function showResults(working_set, type){
  if(showResults.first){
    showResults.first = false;
    $("#workspace #intro").detach();
    $("#workspace").isotope({
      itemSelector: '.results', 
      layoutMode: 'masonry'
    });
  }
  //if type is collection, add collection data
  //if type is analysis, add most recent analysis
  var box = createBox(type);
  var h2 = box.find("h2");
  if(type == "collection"){
    curRefId = working_set["working_set_id"];
    $("#download-json").attr("href", CFG.host + "/fetch/" + curRefId).show();
    h2.html("Collection Data");
    var table = createTable(type, working_set);//this is the HTML created table
    box.append(table);
    box.append(showAllDataBtn().attr("data-type", "collection"));
    box.append(getDownloadButton().attr("data-type", "collection"));
  }
  else if(type == "analysis"){
    h2.html("Analysis Data");
    box.append(createTable(type, working_set));
    var curIndex = working_set["analysis"].length - 1;
    if(working_set["analysis"][curIndex].hasOwnProperty("entry_meta")){
      //show all data button
      box.append(showAllDataBtn().attr("data-type", "analysis").attr('data-index', curIndex));
      box.append(getDownloadButton().attr("data-type", "analysis").attr('data-index', curIndex));
    }
  }
  $("#workspace").isotope('insert' , box);
}
showResults.first = true;

/*
data should be an object containing fields
fields can either be strings or objects
ordering is an array of the field names (optional)
*/
function genForm(data, type, ordering){
  var form = $("<form></form>");
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
  for(var n = 0; n < ordering.length; n++){
    var p = ordering[n];
    if(!data.hasOwnProperty(p)){continue;}
    if(type=="collection")
      console.log(p);
    var row = $("<div class='row'></div>");
    var input = null;
    var inputType = "text";
    var fieldType = "";
    var extra = "";
    if(typeof(data[p]) == "string"){
      fieldType = data[p];
    }
    else if(typeof(data[p] == "object")){
      fieldType = data[p].type;
    }
    switch(fieldType){
      case "numeric":
      input = $("<input type='number' step='any'/>");
      break;
      case "boolean":
      input = $("<select><option value='true'>True</option><option value='false'>False</option></select>");
      break;
      default:
      input = $("<input type='text' />");
      break;
    }
    var fr = /^field_reference\s+(\w+)$/i;
    var match = fr.exec(fieldType);
    if(match){
      input = $("<input type='hidden'/><span class='fieldChooser' data-fieldtype='" + match[1] + "'>Choose a Field</span>");
    }

    if(typeof(data[p] == "object")){
      //check other options
      var hasComment = false;
      var comment = $("<p class='comment'></p>");
      var optional = "";
      if(data[p].hasOwnProperty("optional") && data[p]["optional"]){
        hasComment = true;
        comment.append("<span class='optional'>(optional) </span>");
      }
      if(data[p].hasOwnProperty("comment")){
        hasComment = true;
        comment.append(data[p]["comment"]);
      }
      if(hasComment){
        row.append(comment);
      }
      if(data[p].hasOwnProperty("constraints")){
        if(data[p].constraints.hasOwnProperty("choices")){
          var choices = data[p].constraints.choices;
          //create select field
          input = $("<select></select>");
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
    row.prepend(input).prepend("<label>" + p + "</label>");//use prepend in case comments were added
    form.append(row);
  }
  form.append("<input type='submit' class='button' />");
  return form;
}


function showFields(type){
  $(".field").removeClass("option");
  if(type !== null){
    $(".field[data-fieldtype=" + type + "]").addClass("option");
  }
}

/*
Get all specs, build forms, set up event listeners
*/
function init(){
  tLoad(true);
  $.ajax({
    url: CFG.api_endpoint + "specs",
    dataType: "json",
    type: "GET",
    success : function(data, stat, jqXHR){
      tLoad(false);
      console.log(data);
      //Add Visualization specs
      data.visualization = VIS.specs;
      /*
      - generate the forms
      - attach event listeners
      */
      //generate all forms
      var types = ["analysis", "collection", "visualization"];
      for(var i = 0; i < types.length; i++){
        var type = types[i];
        for(var mod in data[type]){
          if(!data[type].hasOwnProperty(mod)){
            continue;
          }
          //make top level button for module
          $(".type-instructions." + type + " .modules").append("<button class='button' href='#' data-type='" + type + "' data-mod='" + mod + "'>" + mod + "</button>");
          var fns = data[type][mod].functions;
          for(var fn in fns){
            if(!fns.hasOwnProperty(fn)){
              continue;
            }
            var dom_form = $("<div class='function' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'></div>");
            dom_form.append("<h4>" + fn + "</h4>");
            dom_form.append(genForm(fns[fn].param, type, fns[fn].param_order));
            //make sub level button for functio
            $(".type-instructions." + type + " .functions").append("<button class='button' href='#' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'>" + fn + "</button>")
            $("#forms").append(dom_form);
          }
        }
      }

      //add listeners on submission
      $(".function form").on("submit", function(e){0
        e.preventDefault();
        var form = $(this),
            div = form.parent(),
            inputs = form.find("input.toSend"),
            selects = form.find("select.toSend"),
            type = div.attr("data-type"),
            mod = div.attr("data-mod"),
            fn = div.attr("data-fn"),
            params = {};
        $(this).parent().hide();
        $(".type-instructions").hide();
        $(".topbar .item").removeClass("active");
        //show next steps
        $("#next-buttons").fadeIn()
        //show analysis/visualization buttons
        params["input"] = {};
        params['returnAllData'] = $("#allData").prop("checked") ? true : false;
        if((type == "analysis" || type == "visualization") && curRefId != null){
          //add current reference id
          params["working_set_id"] = curRefId;
        }
        for(var i = 0; i < inputs.size(); i++){
          var inp = $(inputs.get(i));
          params["input"][inp.attr("name")] = inp.val();
        }
        for(var i = 0; i < selects.size(); i++){
          var sel = $(selects.get(i));
          params["input"][sel.attr("name")] = sel.val();
        }
        console.log("Sending with params: ");
        console.log(params);
        //ajax call
        if(type == "visualization"){
          var b = createBox('visualization');
          b.find("h2").html("Exploration Results");
          VIS.callFunction(b[0], mod, fn, params,
            function(){
              $("#workspace").isotope("insert", b);
                //Code "borrowed" from http://stackoverflow.com/questions/8973711/export-an-svg-from-dom-to-file
                // Add some critical information
                var svg = b.find("svg");
                svg.attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});
                var svg = '<svg>' + svg.html() + '</svg>';
                var b64 = btoa(svg); // or use btoa if supported
                // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
                b.append($("<a target='_blank' href-lang='image/svg+xml' class='button' href='data:image/svg+xml;base64,\n"+b64+"' title='file.svg'>Download</a>"));
            });
        }
        else{
          tLoad(true);
          //clear cache
          working_set_cache = null;
           $.ajax({
              url: CFG.api_endpoint + "run/" + type + "/" + mod + "/" + fn,
              dataType: "json",
              type: "POST",
              data: params,
              success : function(data, stat, jqXHR){
                console.log("Operator output:");
                console.log(data);
                if(data.hasOwnProperty("error")){
                  showError(data.message);
                  return;
                }
                showResults(data, type);
                if(params['showAllData']){
                  //then this can be put in cache
                  working_set_cache = data;
                }
                //if this was a collection type, show output meta and move onto analysis stage
                //if this was an analysis type, show output and additional analysis options
              },
              complete: function(jqXHR, stat){
                console.log("Complete: " + stat);
                tLoad(false);
              }
            });
        }
       
      });
      //add listeners for buttons (selects #collection a, #analysis a, etc.)
      $(".type-instructions .modules .button").on("click", function(e){
        e.preventDefault();
        //hide all sub menus and forms
        var a = $(this),
            type = a.attr("data-type"),
            mod = a.attr("data-mod");
        var typ = $(".type-instructions." + type);
        typ.find(".mod > .chosen").html(mod);
        typ.find(".fn").fadeIn();
        $(".type-instructions .button, #forms .function").hide();
        typ.find(".functions .button[data-type=" + type + "][data-mod=" + mod + "]").fadeIn();
      });
      $(".type-instructions .functions .button, .type-instructions .sub.fn").on("click", function(e){
        e.preventDefault();
        var a = $(this),
            type = a.attr("data-type"),
            mod = a.attr("data-mod"),
            fn = a.attr("data-fn");
        $(".type-instructions." + type + " .fn > .chosen").html(fn);
        //hide sub menu and forms
        $(".type-instructions .functions .button, #forms .function").hide();
        $("#forms .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
      });

      $(".fieldChooser").click(function(){
        var fType = $(this).attr("data-fieldtype");
        curChooser = $(this);
        showFields(fType);
      });

      $("#workspace").delegate(".field.option", "click" ,function(){
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
      })
      showType("collection"); //initially show collection

     // test();

    }
  });

  $("#download").click(function(e){
    e.preventDefault();
    $("#view textarea, #view #close").fadeIn();
    $.ajax({
            url: CFG.host + "fetch",
            dataType: "json",
            type: "GET",
            data: {'working_set_id': $("#view #refID").val(), 'returnAllData': "true"},
            success : function(data, stat, jqXHR){
              console.log(data);
              working_set_cache = data;
              $("#view textarea").html(JSON.stringify(data));
            },
        });
  });
  $("#close").click(function(e){
    e.preventDefault();
    $(this).fadeOut();
    $("#view textarea").fadeOut();
  })

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
  })


  $(".sub.mod, .sub.fn").on("click", function(){
    $(this).find(".chosen").html("");
    showType($(this).attr("data-type"));
    $("#topbar .item").removeClass("active");
    $("#topbar .item.c").addClass("active");
  });

  $("#next-buttons .button").on("click", function(){
    if($(this).attr("data-type") == "a"){
      showType('analysis');
    }
    else{
      showType('visualization');
    }
  });

  $.ajax({
    url : "https://api.github.com/repos/InfoSeeking/Socrates",
    dataType: "json",
    success : function(json){
      console.log(json);
      var dateStr = json.updated_at + "";
      $("#last-modified").html("SOCRATES code base last updated on " + dateStr.replace(/[TZ]/g, ' '));
    }
  })
  $("#settings-btn").click(function(){
    if(sidebar == "settings"){
      sidebar = "default";
      //go back
      $(this).html("Settings");
      $(".screen").hide();
      $(".screen.default").show();
    }
    else{
      $("#import-btn").html("Import Data");
      $(this).html("Back");
      sidebar = "settings";
      $(".screen").hide();
      $(".screen.settings").show();
    }
  });

  $("#import-btn").click(function(){
    if(sidebar == "import"){
      sidebar = "default";
      //go back
      $(this).html("Import Data");
      $(".screen").hide();
      $(".screen.default").show();
    }
    else{
      $("#settings-btn").html("Settings");
      $(this).html("Back");
      sidebar = "import";
      $(".screen").hide();
      $(".screen.import").show();
    }
  });

  $("#fileupload-btn").click(function(){
    $("#fileupload").click();
  });
 
  $("#showAllData").on("click", handleDataButton);
}

$("#refresh-btn").click(function(){
  location.reload(true);
});


function test(){
  var f = $("div[data-fn=tw_search]");
  f.find("input[name=count]").val(10);
  f.find("input[name=query]").val("test");
  f.find("input[name=lang]").val("en");
  f.find("form").submit()
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
}

$(document).ready(init);
