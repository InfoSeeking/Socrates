<?php
/*
 * Python should do heavy lifting, this should 
 * be a dead simple API listener.
 *
 * Seperating this also has the added benefit of making it easier to run
 * SOCRATES since it would be no longer bound to the API. It could be
 * run from command line.
 *
 * Test: 
 http://localhost/socrates/back-end/listener.php/run/collection/twitter/tw_search?input={%22query%22:%20%22world%20cup%22,%20%22count%22%20:%2010,%20%22lang%22%20:%20%22en%22}

 Before Pushing:
 - install tweepy on server
 - redirect stderr to an error log (may need to play around with permissions for this)
 */
require_once("phplib/Toro.php");//Routing library

header("Access-Control-Allow-Origin: *");

function getParam($field, $DATA, $required=false, $default=null){
    if (!isset($DATA[$field])) {
        if ($required) {
            throw new InvalidArgumentException(sprintf("Required field '%s' not passed", $field));
        } else {
            return $default;
        }
    }
    return $DATA[$field];
}

function enforceMatch($val, $regex, $argname=""){
    if(!preg_match($val, $regex)){
        if($argname) throw new InvalidArgumentException(sprintf("Invalid argument passed for '%s': %s", $argname, $needle));
        else throw new InvalidArgumentException(sprintf("Invalid argument: %s", $needle));
    }
}

class RunHandler {
	public function post($type, $module, $fn){
        $working_set_id = getParam("working_set_id", $_POST, false, null);
        $return_all_data = getParam("return_all_data", $_POST) ? "--return_all_data" : "";
        $input = getParam("input", $_POST, false, "{}");

        //validate all inputs
        enforceMatch("/^[_a-zA-Z0-9]+$/", $type, "type name");
        enforceMatch("/^[_a-zA-Z0-9]+$/", $module, "module name");
        enforceMatch("/^[_a-zA-Z0-9]+$/", $fn, "function name");
        enforceMatch("/^[_a-zA-Z0-9]*$/", $working_set_id, "working set id");

        $working_set_str = "";
        if (is_array($input)) {
            $input =json_encode($input);
            //TODO: resolve this in a better way
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {//IS WINDOWS
                $input =  addcslashes($input, '"\\/');
            } else {
                $input = escapeshellarg($input);
            }
        }

        if ($working_set_id) {
            $working_set_str = "--working_set_id " . $working_set_id;
        }
        $cmd = sprintf("python socrates_cli.py --log %s %s --input %s --run %s %s %s 2>&1", $working_set_str, $return_all_data, $input, $type, $module, $fn);
        //TODO: should I log the command here?
		echo shell_exec($cmd);
	}
}

class SpecHandler {
    public function get(){
        //get from command line tool
        $cmd = sprintf("python socrates_cli.py --log --specs");
		echo shell_exec($cmd);
	}
}

class FetchHandler {
    public function get(){
        $working_set_id = getParam("working_set_id", $_GET, true);
        enforceMatch("/^[_a-zA-Z0-9]*$/", $working_set_id, "working set id");
        $cmd = sprintf("python socrates_cli.py --log --fetch --working_set_id %s 2>&1", $working_set_id);
        //echo $cmd;
        echo shell_exec($cmd);
    }
}

ToroHook::add("404",  function() {
    echo "Route not found. Check logs/ for python output/errors."; //TODO: add documentation
});

Toro::serve(array(
	"/run/:alpha/:alpha/:alpha" => "RunHandler",
	"/specs" => "SpecHandler",
    "/fetch" => "FetchHandler"
));

?>
