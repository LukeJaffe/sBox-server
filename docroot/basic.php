<?php

    include "php/connection.php";

    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

    $servername = "localhost";
    $username = "webuser";
    $password = "password";
    $dbname = "snake_db";

    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    $name = $_GET["p1"];
    $score = $_GET["p2"];
    $sql = "INSERT INTO high_scores (name, score) 
            VALUES ('" . $name . "', '" . $score . "');";

    if ($conn->query($sql) === TRUE) {
        echo "WRITE";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $sql = "SELECT * FROM high_scores;";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) 
    {
        // output data of each row
        while($row = $result->fetch_assoc()) 
        {
            echo $row["name"] . "|" . $row["score"] . "\n";
        }
    } 
    else 
    {
        echo "0 results";
    }
    // Close connection
    $conn->close();
?>
