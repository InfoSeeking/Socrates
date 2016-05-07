var API = {
    sendRequest: function(args) {
        UI.toggleLoader(true);
        $.ajax({
            url: UTIL.CFG.api_endpoint,
            dataType: "json",
            contentType: "application/json",
            data : JSON.stringify(args.data),
            type: "POST",
            success: function(data) {
                UI.toggleLoader(false);
                if (data.error) {
                    if (args.error) args.error(data);
                } else {
                    if (args.success) args.success(data);
                }
            },
            error: function() {
                UI.toggleLoader(false);
                if (args.error) args.error({error: true, message: "Server error"});
                 UI.feedback("Server error", true);
            }
        });
    }
};