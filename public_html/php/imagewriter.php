<?php
    $data = $_POST['data'];
    $name = $_POST['fname'];
    $result = base64_decode($data);
    file_put_contents($name, $result);
    echo $image;
?>