<?php

//load and connect to MySQL database stuff
require("config.inc.php");

if (!empty($_POST)) {
    
    $query_params = array(
        ':boxID' => $_POST['boxID']
    );

    $box_part = $_POST['box_part'];
    if ($box_part == 0)
    {
        $query ="SELECT 
                    door_status
                FROM box
                WHERE 
                    boxID = :boxID";
    }
    else if ($box_part == 1)
    {
        $query ="SELECT 
                    lock_status
                FROM box
                WHERE 
                    boxID = :boxID";
    }
    else
    {
        //fail
    }
    
    try {
        $stmt   = $db->prepare($query);
        $result = $stmt->execute($query_params);
    }
    catch (PDOException $ex) {
        // For testing, you could use a die and message. 
        //die("Failed to run query: " . $ex->getMessage());
        
        //or just use this use this one to product JSON data:
        $response["success"] = 0;
        $response["message"] = "Database Error1. Please Try Again!";
        die(json_encode($response));
        
    }

    // Do the MySQL query
    $row = $stmt->fetch();
    // Return the lock status in json form
    $response["success"] = 1;
    $response["message"] = "Lock status check successful!";

    $response["box_part"] = $box_part;
    if ($box_part == 0)
    {
        $response["part_status"] = $row["door_status"];
    }
    else if ($box_part == 1)
    {
        $response["part_status"] = $row["lock_status"];
    }
    else
    {
        //fail
    }

    die(json_encode($response));

} else {
?>
		<h1>Box Status</h1> 
	<?php
}

?> 

