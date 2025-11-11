<?php 

header("Content-type: application/json");

    if($_SERVER["REQUEST_METHOD"] != "POST"){
        echo "Invalid request!";
        exit;
    } else{

        $invalid_count = 0;

        $full_name_status = true;
        $email_status = true;
        $message_status = true;

        if(!isset($_POST["fullname"]) || trim($_POST["fullname"]) === "") {
            $full_name_status = false;
            $invalid_count++;
        }
        if(!isset($_POST["message"]) || trim($_POST["message"]) === "") {
            $message_status = false;
            $invalid_count++;
        }
        if(!isset($_POST["email"]) || !preg_match("/^[\w\.-]+@[\w\.-]+\.\w{2,}$/", $_POST["email"])) {
            $email_status = false;
            $invalid_count++;
        }

        $result = [
            "status" => "success",
            "message" => "",
            "validity" => [
                "full_name_validity" => $full_name_status,
                "email_validity" => $email_status,
                "message_validity" => $message_status
            ]
        ];

        if($invalid_count > 0){
            $result["status"] = "failed";
            $result["message"] = "Check your inputs and try again.";

            echo json_encode($result);
            exit;
        } else {
            $full_name_input = htmlspecialchars(ucwords(strtolower($_POST["fullname"])));
            $email_input = htmlspecialchars(strtolower($_POST["email"]));
            $message_input = htmlspecialchars($_POST["message"]);

            require_once "db-config.php";

            $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $full_name_input, $email_input, $message_input);

            if($stmt->execute()){
                $result["message"] = "success";
                echo json_encode($result);
                exit;
            } else{
                $result["message"] = "error";
                echo json_encode($result);
                exit;
            }
        }
    }
?>