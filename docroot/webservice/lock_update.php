<?php

//load and connect to MySQL database stuff
require("config.inc.php");

if (!empty($_POST)) {
    //gets user's info based off of a username.
    $query = "UPDATE 
                box 
              SET 
                lock_status=:lock_status 
              WHERE 
                boxID=:boxID";
    
    $query_params = array(
        ':boxID' => $_POST['boxID'],
        ':lock_status' => $_POST['lock_status']
    );
    
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
    //$row = $stmt->fetch();
    // Return the lock status in json form
    $response["success"] = 1;
    $response["message"] = "Lock status check successful!";
    die(json_encode($response));

} else {
?>
		<h1>Lock Update</h1> 
	<?php
}

?> 

