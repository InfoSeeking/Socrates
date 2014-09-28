<?php
/*
 * Python should do heavy lifting, this should be a dead simple API listener.
 */

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

function writeToTemp($name, $contents, $ext="json") {
    $filename = "parameters/" . $name . microtime() . "." . $ext;
    if(file_put_contents($filename, $contents) === false) {
        throw new Exception("Cannot write to parameter file");
    }
    return $filename;
}

$parameters = getParam("parameters", $_POST, true);
$param_file = writeToTemp("parameters", json_encode($parameters), "json");
$cmd = sprintf("python socrates_cli.py --log --param %s 2>&1", $param_file);
echo shell_exec($cmd);
//unlink($param_file);

?>
