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
    form.append("<div class='r'><label>Reference ID</label><input type='text' value='5334acc939827c11cfb98913' class='toSend' name='reference_id'/></div>");
  }
  for(var p in data){
    if(!data.hasOwnProperty(p)){continue;}
    //For now, just make them all text fields. This will obviously be changed later.
    var inputType = "text";
    if(typeof(data[p]) == "string"){
      if(data[p] == "numeric"){
        inputType = "number";
      }
    }
    else if(typeof(data[p] == "object")){
      if(data[p].type == "numeric"){
        inputType = "number";
      }
    }
    form.append("<div class='r'><label>" + p + "</label><input class='toSend' type='" + inputType + "' name='" + p + "'/></div>");
  }
  form.append("<input type='submit' />");
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
          $("#" + type).append("<a class='btn' href='#' data-type='" + type + "' data-mod='" + mod + "'>" + mod + "</a>")
          var fns = data[type][mod].functions;
          for(var fn in fns){
            if(!fns.hasOwnProperty(fn)){
              continue;
            }
            var dom_form = $("<div class='function' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'></div>");
            dom_form.append("<h4>" + fn + "</h4>");
            dom_form.append(genForm(fns[fn].param, type));
            //make sub level button for functio
            $("#subs").append("<a class='sub btn' href='#' data-type='" + type + "' data-fn='" + fn + "' data-mod='" + mod + "'>" + fn + "</a>")
            $("#forms").append(dom_form);
          }
        }
      }

      //add listeners on submission
      $(".function form").on("submit", function(e){
        e.preventDefault();
        var form = $(this),
            div = form.parent(),
            inputs = form.find("input.toSend"),
            type = div.attr("data-type"),
            mod = div.attr("data-mod"),
            fn = div.attr("data-fn"),
            params = {};
        params['returnAllData'] = $("#allData").prop("checked") ? "true" : "false";
        for(var i = 0; i < inputs.size(); i++){
          var inp = $(inputs.get(i));
          params[inp.attr("name")] = inp.val();
        }
        console.log(params);
        //ajax call
        if(type == "visualization"){
          $("#vis").empty();
          VIS.callFunction($("#vis")[0], mod, fn, params);
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
                showWorkingSet(data);
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
      var qStr = "";
      var first = true;
      for(var i = 0; i < types.length; i++){
        if(!first){
          qStr += ", ";
        }
        qStr += "#" + types[i] + " a";
        first = false;
      }
      $(qStr).on("click", function(e){
        e.preventDefault();
        //hide all sub menus and forms
        var a = $(this),
            type = a.attr("data-type"),
            mod = a.attr("data-mod");
        $("#subs a, #forms .function").hide();
        $("#subs a[data-type=" + type + "][data-mod=" + mod + "]").fadeIn();
      });
      $("#subs a").on("click", function(e){
        e.preventDefault();
        var a = $(this),
            type = a.attr("data-type"),
            mod = a.attr("data-mod"),
            fn = a.attr("data-fn");
        //hide sub menu and forms
        $("#subs a, #forms .function").hide();
        $("#forms .function[data-type=" + type + "][data-mod=" + mod + "][data-fn=" + fn + "]").fadeIn();
      });
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