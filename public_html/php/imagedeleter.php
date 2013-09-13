<?php
    session_start();

    $files = glob("temp/*");

    foreach($files as $file){ // iterate files
        if(is_file($file))
        unlink($file); // delete file
    }
?>