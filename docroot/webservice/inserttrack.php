<?php
//load and connect to MySQL database stuff
require("config.inc.php");
if (!empty($_POST)) {
 //initial query
 $query = "INSERT INTO track ( trackID, status, description, user ) VALUES ( :trackID, :status, :description, :userID)";

 //Update query
 $query_params = array(
 ':trackID' => $_POST['trackID'],
 ':status' => $_POST['status'],
':description' => $_POST['description'],
':userID' => $_POST['userID']

 );

 //execute query
 try {
 $stmt = $db->prepare($query);
 $result = $stmt->execute($query_params);
 }
 catch (PDOException $ex) {
 // For testing, you could use a die and message.
 //die("Failed to run query: " . $ex->getMessage());

 //or just use this use this one:
 $response["success"] = 0;
 $response["message"] = "Database Error. Couldn't add post!";
 die(json_encode($response));
 }


 $response["success"] = 1;
 $response["message"] = "TrackID Successfully Added!";
 echo json_encode($response);

} else {
?>
 <h1>Add TrackID</h1>
 <form action="inserttrack.php" method="post">
 UserID:<br />
 <input type="text" name="userID" placeholder="post userID" />
 <br /><br />
TrackID:<br />
 <input type="text" name="trackID" placeholder="post trackID" />
 <br /><br />
 Status:<br />
 <input type="text" name="status" placeholder="post status" />
 <br /><br />
 Description:<br />
 <input type="text" name="description" placeholder="post description" />
 <br /><br />
 <input type="submit" value="Add trackID" />
 </form>
 <?php
}
?>
