<?php
    session_start();
    
    $id = session_id();    
    $name = $_GET['fname'];
    $path = $id . $name;
    unlink($path);
?>