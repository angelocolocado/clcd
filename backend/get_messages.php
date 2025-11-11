<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access."
    ]);
    exit;
}

header('Content-Type: application/json');
include 'db-config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all messages ordered by newest first
    $sql = "SELECT id, name, email, message, date_sent FROM contact_messages ORDER BY date_sent DESC";
    $result = $conn->query($sql);
    
    if ($result === false) {
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $conn->error
        ]);
        exit;
    }
    
    $messages = [];
    
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'message' => $row['message'],
            'date_sent' => $row['date_sent']
        ];
    }
    
    echo json_encode([
        "status" => "success",
        "data" => $messages,
        "total" => count($messages)
    ]);
    
    $conn->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
}
