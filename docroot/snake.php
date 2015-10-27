<?php
    echo 'test1'
    header('Access-Control-Allow-Origin: *');
    //header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    echo 'test2'


    //if (isset($_GET["w1"]) && isset($_GET["w2"])) 
    //{
        // Put the two words together with a space in the middle to form "hello world"
    //    $hello = $_GET["w1"] . " " . $_GET["w2"];
    //}

    $servername = "localhost";
    $username = "webuser";
    $password = "password";
    $dbname = "snake_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    //if ($conn->connect_error) {
    //    echo "connection fail"
    //    die("Connection failed: " . $conn->connect_error);
    //} 


    if ($_GET["p1"] == "WRITE")
    {
        $name = $_GET["p2"];
        $score = $_GET["p3"];
        $sql = "INSERT INTO high_scores (name, score) 
                VALUES ('" . $name . "', '" . $score . "');";

        if ($conn->query($sql) === TRUE) {
            echo "WRITE";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    else if ($_GET["p1"] == "READ")
    {
        $sql = "SELECT * FROM high_scores;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) 
        {
            // output data of each row
            while($row = $result->fetch_assoc()) 
            {
                echo $row["name"] . "|" . $row["score"] . " ";
            }
        } 
        else 
        {
            echo "0 results";
        }
    }
    else
    {
        echo "error: bad p1";
    }

    $conn->close();
?>
