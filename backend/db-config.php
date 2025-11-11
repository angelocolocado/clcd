<?php 

    $hostname = "localhost";
    $username = "root";
    $password = "";
    $db_name = "portfolio_db";

    try{
        $conn = new mysqli($hostname, $username, $password, $db_name);
    } catch(mysqli_sql_exception){
        echo "Database connection error.";
        exit;
    }

?>