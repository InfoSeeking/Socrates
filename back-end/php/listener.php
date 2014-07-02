<?php
/*
 * TODO: create a command line Python program accepting the necessary data 
 * and pipe stdout back to user. Python should do heavy lifting, this should 
 * be a dead simple API listener.
 *
 * Seperating this also has the added benefit of making it easier to run
 * SOCRATES since it would be no longer bound to the API. It could be
 * run from command line.
 */
require_once("lib/Toro.php");//Routing library

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

class RunHandler {
	public function get($type, $module, $fn){
        $working_set_id = getParam("working_set_id", $_GET);
        $return_all_data = getParam("return_all_data", $_GET) == "true" ? "return_all_data" : "";
        $input = escapeshellarg(getParam("input", $_GET, false, "{}"));
        $cmd = sprintf("cd ../ && python socrates_cli.py %s --input %s --run %s %s %s 2>&1", $return_all_data, $input, $type, $module, $fn);
        echo $cmd;
        $out = [];
		exec($cmd, $out);
        echo implode("<br/>", $out);
	}
}

class SpecHandler {
    public function get(){
        //get from command line tool
		echo "Specs";
	}
}

Toro::serve(array(
	"/run/:alpha/:alpha/:alpha" => "RunHandler",
	"/specs" => "SpecHandler"
));

?>
