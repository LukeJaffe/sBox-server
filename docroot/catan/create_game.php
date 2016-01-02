<?php
    header('Access-Control-Allow-Origin: http://lucx.info');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');

    session_start();

    $servername = "localhost";
    $dbusername = "webuser";
    $dbpassword = "password";
    $dbname = "catan_db";

    $game = $_POST['game'];
    $players = $_POST['players'];
    $host = $_SESSION['username']; 

    if ($host === "")
    {
        die("Log in to create a game!");
    }

    // Create connection
    $conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

    $sql = "INSERT INTO lobby_table (game, host, players) 
            VALUES ('" . $game . "', '" . $host . "',"  . $players . ");";
    if ($conn->query($sql) === TRUE)
    {
        echo "SUCCESS";
    }
    else
    {
        echo "ERROR: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
?>

