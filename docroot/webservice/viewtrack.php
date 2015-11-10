<?php

//load and connect to MySQL database stuff
require("config.inc.php");

if (!empty($_POST)) {
    //gets user's info based off of a username.
    $query = " SELECT DISTINCT trackID, description, status 
			FROM track
			WHERE user = :userID
        ";
    
    $query_params = array(
        ':userID' => $_POST['userID']
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
    
    //This will be the variable to determine whether or not the user's information is correct.
    //we initialize it as false.
    $validated_info = false;
    
    //fetching all the rows from the query
    $rows = $stmt->fetchAll();
    if ($rows) {
	$response["success"] = 1;
    $response["message"] = "Post Available!";
    $response["posts"]   = array();
    
    foreach ($rows as $row) {
        $post             = array();
        $post["trackID"]  = $row["trackID"] ; 
        $post["status"] = $row["status"];
        $post["description"]    = $row["description"];
        
        
        //update our repsonse JSON data
        array_push($response["posts"], $post);
    }
    
    // echoing JSON response
    echo json_encode($response);
    }
     else {
        $response["success"] = 0;
        $response["message"] = "No Data Available!";
        die(json_encode($response));
    }
} else {
?>
 <h1>ViewTrack</h1> 
                <form action="viewtrack.php" method="post"> 
                    userID:<br /> 
                    <input type="text" name="userID" placeholder="userID" /> 
                    <br /><br /> 
                    <input type="submit" value="View" /> 
                </form> 
        <?php
}

?> 

