<?php
    $src = $_GET['src'];
    $temp = $_GET['temp'];
    $dest = "/temp" . $temp;
    //$check = file_put_contents($dest, file_get_contents($src));
    $im = file_get_contents($src);
    $imdata = base64_encode($im); 
    //encode image here

    //delete temp image here 
    
    
    //echo back jsonp with image as 64 encoded data here
    echo $_GET['callback'] . '(' . "{'result' : '" . $imdata . "'}" . ')';

?>