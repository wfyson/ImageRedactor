<?php
    $src = $_GET['src'];
    $temp = $_GET['temp'];
    $dest = "/temp" . $temp;
    $check = file_put_contents($dest, file_get_contents($src));
    
    //encode image here

    //delete temp image here 
    
    
    //echo back jsonp with image as 64 encoded data here
    echo $_GET['callback'] . '(' . "{'result' : '" . $check . "'}" . ')';

?>