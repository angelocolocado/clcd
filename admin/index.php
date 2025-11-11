<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Angelo R. Colocado - Full-Stack Developer & Creative Technologist Portfolio">
    <meta name="theme-color" content="#000000">
    
    <title>CLCD - ADMIN</title>
    <link rel="icon" type="image/x-icon" href="../assets/logo/logo-favicon.svg">
    
    <!-- Preconnect to external domains for faster resource loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <!-- DNS Prefetch for additional performance -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    
    <!-- Critical CSS - Load inline or first -->
    <link rel="stylesheet" href="../styles/header.css">
    <link rel="stylesheet" href="../styles/loader.css">
    <link rel="stylesheet" href="../styles/admin.css">
    
    <!-- Optimized Font Loading with display=swap for no FOIT (Flash of Invisible Text) -->
    <link href="https://fonts.googleapis.com/css2?family=Baloo+Thambi+2:wght@400..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
</head>

<header><!--INJECTED BY PAGE MANAGER--></header>

<body>

    <main><!--INJECTED BY PAGE MANAGER--></main>

    <script type="module" src="admin.js"></script>
    
</body>

</html>