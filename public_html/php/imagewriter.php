<?php
    session_start();

    $data = $_POST['data'];
    $name = $_POST['fname'];
    $id = session_id();
    $path = "temp/" . $id . $name;
    
    $result = base64_decode($data);
    file_put_contents($path, $result);
?>