var curRefId = null;

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
})

/*
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
  $("#overlay table").empty().append(thead).append(tbody);
  $("#overlay").fadeIn();
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

$("#showAllData").on("click", handleDataButton);

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
      var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
      table.find("tbody").append(row);
      section = table;
    }
  }
  else if(type == "analysis"){
    var an = set.analysis[set.analysis.length - 1];
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
        var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
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

var first = true;
function showResults(data, type){
  if(first){
    first = false;
    $("#workspace #intro").detach();
    $("#workspace").isotope({
      itemSelector: '.results', 
      layoutMode: 'masonry'
    });
  }
  //if type is collection, add collection data
  //if type is analysis, add most recent analysis
  console.log("Showing results");
  $("#ref b").html(data.reference_id);
  var box = createBox(type);
  var h2 = box.find("h2");
  if(type == "collection"){
    curRefId = data["reference_id"];
    h2.html("Collection Data");
    box.append(createTable(type, data));
    box.append(showAllDataBtn().attr("data-type", "collection"));
  }
  else if(type == "analysis"){
    h2.html("Analysis Data");
    box.append(createTable(type, data));
    var curIndex = data["analysis"].length - 1;
    if(data["analysis"][curIndex].hasOwnProperty("entry_meta")){
      //show all data button
      box.append(showAllDataBtn().attr("data-type", "analysis").attr('data-index', curIndex));
    }
  }
  $("#workspace").isotope('insert' , box);
}

function showWorkingSet(set){
  $(".analysis_section").detach();
  var ws = $("#working_set");
  ws.find("#ref b").html(set.reference_id);
  ws.find("#num_entries b").html(set.data.length);
  var table = ws.find("table");
  table.find("tbody").empty();

  //TODO: separate meta parsing to rows as a separate helper function to be more DRY
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
    var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
    table.find("tbody").append(row);
    $("#working_set").fadeIn();
  }


  //now show analysis data
  if(set.hasOwnProperty("analysis")){
    for(var i = 0; i < set.analysis.length; i++){
        var an = set.analysis[i];
        var a_section = $("<div class='analysis_section'></div>");
        if(i == 0){
          a_section.addClass("first");
        }
        if(an.hasOwnProperty("aggregate_meta")){
          //check for aggregate data
          a_section.append("<h4>Aggregate Data</h4>");
          var ag_table = table.clone();
          ag_table.addClass("analysis_table");
          ag_table.find("tbody").empty();
          ag_table.find("thead tr th:nth-child(3)").html("Value");
          for(var field in an.aggregate_meta){
            if(!an.aggregate_meta.hasOwnProperty(field)){continue;}
            var type = an.aggregate_meta[field];
            if(typeof(type) == "object"){
              type = type.type;//lol
            }
            var sample = an.aggregate_analysis[field];
            var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
            ag_table.find("tbody").append(row);
          }
          
          a_section.append(ag_table);
        }

        if(an.hasOwnProperty("entry_meta")){
          //show entry data
          a_section.append("<h4>Entry Data</h4>");
          var en_table = table.clone();
          en_table.addClass("analysis_table");
          en_table.find("tbody").empty();
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
            var row = $("<tr><td>" + field + "</td><td>" + type + "</td><td>" + sample + "</td></tr>");
            en_table.find("tbody").append(row);
          }
          a_section.append(en_table);
        }
        ws.append(a_section);
      }
    }
}
/*
data should be an object containing fields
fields can either be strings or objects
*/
function genForm(data, type){
  var form = $("<form></form>");
  if(type == "analysis" || type == "visualization"){
    //add reference to database
    //form.append("<div class='row'><label>Reference ID</label><input type='text' class='toSend' name='reference_id'/></div>");
  }
  for(var p in data){
    if(!data.hasOwnProperty(p)){continue;}
    //For now, just make them all text fields. This will obviously be changed later.
    var inputType = "text";
    var extra = "";
    if(typeof(data[p]) == "string"){
      if(data[p] == "numeric"){
        inputType = "number";
      }
    }
    else if(typeof(data[p] == "object")){
      if(data[p].type == "numeric"){
        inputType = "number";
      }
      var optional = "";
      if(data[p].hasOwnProperty("optional") && data[p]["optional"]){
        optional = "<span class='optional'>(optional) </span>";
      }
      if(data[p].hasOwnProperty("comment")){
        extra += "<p class='comment'>" + optional + data[p]['comment'] + "</p>"
      }
      else{
        extra += "<p class='comment'>" + optional + "</p>";
      }
    }
    form.append("<div class='row'><label>" + p + "</label><input class='toSend' type='" + inputType + "' step='any' name='" + p + "'/>" + extra + "</div>");
  }
  form.append("<input type='submit' class='button' />");
  return form;
}

$.ajax({
  url: CFG.host + "/specs",
  dataType: "json",
  type: "POST",
  success : function(data, stat, jqXHR){
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
        $(".type-instructions." + type + " .modules").append("<button class='button' href='#' data-type='" + type + "' data-mod='" + mod + "'>" + mod + "</button>")
        var fns = data[type][mod].functions;
        for(var fn in fns){
          if(!fns.hasOwnProperty(fn)){
            continue;
          }
          var dom_form = $("<div class='function' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'></div>");
          dom_form.append("<h4>" + fn + "</h4>");
          dom_form.append(genForm(fns[fn].param, type));
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
      


      params['returnAllData'] = $("#allData").prop("checked") ? "true" : "false";
      if((type == "analysis" || type == "visualization") && curRefId != null){
        //add current reference id
        params["reference_id"] = curRefId;
      }
      for(var i = 0; i < inputs.size(); i++){
        var inp = $(inputs.get(i));
        params[inp.attr("name")] = inp.val();
      }
      console.log(params);
      //ajax call
      if(type == "visualization"){
        $("#vis").empty();
        var b = createBox('visualization');
        b.find("h2").html("Visualization Results");

        VIS.callFunction(b[0], mod, fn, params,
          function(){
            $("#workspace").isotope("insert", b);
          });
      }
      else{
        //clear cache
        working_set_cache = null;
         $.ajax({
            url: CFG.host + "/op/" + type + "/" + mod + "/" + fn,
            dataType: "json",
            type: "POST",
            data: params,
            success : function(data, stat, jqXHR){
              console.log("Operator output:");
              console.log(data);
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
    showType("collection"); //initially show collection

    test();

  }
});

$("#download").click(function(e){
  e.preventDefault();
  $("#view textarea, #view #close").fadeIn();
  $.ajax({
          url: CFG.host + "/download",
          dataType: "json",
          type: "POST",
          data: {'reference_id': $("#view #refID").val(), 'returnAllData': "true"},
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


function test(){
  var f = $("div[data-fn=tw_search]");
  f.find("input[name=count]").val(10);
  f.find("input[name=query]").val("test");
  f.find("input[name=lang]").val("en");
  f.find("form").submit()
}