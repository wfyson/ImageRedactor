<?php
    session_start();
    
    $id = session_id();    
    $name = $_GET['fname'];
    $path = "temp/" . $id . $name;
    unlink($path);
?>