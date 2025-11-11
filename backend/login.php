<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    $admin_username = 'admin';
    $admin_password_hash = '$2y$10$cVvlXIcTc0i.o/tBSmrIl.N3NQ2hP7xReHHwntJYLPQ2tw9WKmj7G';
    
    if (empty($username) || empty($password)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Username and password are required.'
        ]);
        exit;
    }
    
    if ($username === $admin_username && password_verify($password, $admin_password_hash)) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = time();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful.',
            'redirect' => 'index.php'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid username or password.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
}
