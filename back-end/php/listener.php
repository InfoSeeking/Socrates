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

class RootHandler {
	public function get(){
		echo "SOCRATES endpoint";
	}
}

class SpecHandler {
    public function get(){
        //get from command line tool
		echo "Specs";
	}
}

Toro::serve(array(
	"/" => "RootHandler",
	"/specs" => "SpecHandler"
));

?>
