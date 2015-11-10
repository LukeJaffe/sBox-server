<?php

//load and connect to MySQL database stuff
require("config.inc.php");

if (!empty($_POST)) {
    //gets user's info based off of a username.
    $query = " 
            SELECT 
               *
           FROM track
           WHERE 
               trackID = :trackID
 
        ";
    
    $query_params = array(
        ':trackID' => $_POST['trackID']
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


    
    //This will be the variable to determine whether or not the user's information is corre$
    //we initialize it as false.
    $validated_info = false;
    
    //fetching all the rows from the query
    $row = $stmt->fetch();
    if ($row) {
        //if we encrypted the password, we would unencrypt it here, but in our case we just
        //compare the two passwords
        if ($_POST['trackID'] === $row['trackID']) {
 		$login_ok = true;


 //gets user's info based off of a username.
    $query = " 
            UPDATE track SET  status =  'DELIVERED'
           WHERE 
               trackID = :trackID
        ";
    
    $query_params = array(
        ':trackID' => $_POST['trackID']
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


        }
    }

// If the user logged in successfully, then we send them to the private members-only page 
    // Otherwise, we display a login failed message and show the login form again 
    if ($login_ok) {
        $response["success"] = 1;
        $response["message"] = "Search successful!";
        die(json_encode($response));
    } else {
        $response["success"] = 0;
        $response["message"] = "Invalid Credentials!";
        die(json_encode($response));
    }
} else {
?>
			 <h1>Track</h1> 
                <form action="track.php" method="post"> 
                    TrackID:<br /> 
                    <input type="text" name="trackID" placeholder="trackID" /> 
                    <br /><br /> 
                    <input type="submit" value="Scan" /> 
                </form> 
        <?php
}

?> 


