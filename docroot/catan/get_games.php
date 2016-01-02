<?php
    header('Access-Control-Allow-Origin: http://lucx.info');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');

    session_start();

    $servername = "localhost";
    $dbusername = "webuser";
    $dbpassword = "password";
    $dbname = "catan_db";

    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

    $sql = "SELECT * FROM lobby_table;";
    $result = $conn->query($sql);

    /* fetch object array */
    $array = array();
    while ($row = $result->fetch_array())
    {
        $array[] = $row;
    }
    echo json_encode($array);

    /* free result set */
    $result->close();

    $conn->close();
?>

