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

function getFilename($base, $ext){
    $num = "";
    while(file_exists($base . $num . "." . $ext)){
        if($num == ""){
            $num = 1;
        } else {
            $num++;
        }
    }
    return $base . $num . "." . $ext;
}

function writeToTemp($name, $contents, $ext="json") {
    date_default_timezone_set('America/New_York');
    $filename = getFilename("parameters/" . $name . date("h_m_s") , $ext);
    if(file_put_contents($filename, $contents) === false) {
        throw new Exception("Cannot write to parameter file");
    }
    return $filename;
}

/*
Download is a special case, since all data needs to be encoded as GET request
*/
if(getParam('force_download', $_GET, false, false)){
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=working_set.json');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');

    $param_file = writeToTemp("p_", json_encode($_GET), "json");
    $cmd = sprintf("python socrates_cli.py --log --param %s 2>&1", $param_file);
    echo shell_exec($cmd);
    unlink($param_file);
} else{
    //standard run, uses POST request
    $param_file = writeToTemp("p_", json_encode($_POST), "json");
    $cmd = sprintf("python socrates_cli.py --log --param %s 2>&1", $param_file);
    echo shell_exec($cmd);
    unlink($param_file);
}
?>
